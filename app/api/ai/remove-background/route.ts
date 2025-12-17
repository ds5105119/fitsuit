import { ContentListUnion, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_GENAI_API_KEY가 설정되지 않았습니다." }, { status: 400 });
  }

  try {
    const { userImage } = await req.json();

    if (!userImage || typeof userImage !== "string" || !userImage.startsWith("data:")) {
      return NextResponse.json({ error: "잘못된 이미지 데이터입니다." }, { status: 400 });
    }

    const prompt = `
You are an expert background remover.

SOURCE
- Use ONLY the first inline image as input.
- The foreground subject is the person (head to toe). Everything that is NOT the person is background.

TASK
- Keep the person exactly as-is: same pose, same body proportions, same clothing.
- Remove 100% of the original background, including floor, wall, sky, furniture, props, text, and any blank or padded areas.
- Create a NEW canvas behind the person and fill it with a single flat color: #f5f5f5.

HARD RULES — NO EXCEPTIONS
- Do NOT crop out or cut off any part of the body (no missing feet, hands, or head).
- Do NOT keep, blend, or reuse any pixel from the original background.
- Treat all floor, shadows on the floor or wall, and any environment lighting as background. Replace them with #f5f5f5.
- The new background must be a single flat color (#f5f5f5) with ZERO gradients, shadows, glows, patterns, textures, or transparent areas.
- The ONLY non-#f5f5f5 pixels in the final image must belong to the person and what they are wearing (clothes, accessories, hair).

FINAL SELF-CHECK
Before returning the image, check the following:

1) BACKGROUND
   - Zoom in mentally and verify that every pixel that is not part of the person is exactly #f5f5f5.
   - There must be no remaining pieces of the original scene, floor, wall, background color, or letterbox padding.

2) PERSON
   - Confirm that the person is fully intact from head to toe, with no body parts cropped out or cut off.

If any original background or floor/shadow pixels remain, or if any body part is missing,
FIX THE IMAGE FIRST and only then return the final result.`;

    const ai = new GoogleGenAI({ apiKey });
    const contents: ContentListUnion = [
      { inlineData: { data: userImage.split(",")[1] || "", mimeType: userImage.match(/data:(.*);base64/)?.[1] || "image/png" } },
      { text: prompt },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: { responseModalities: ["IMAGE"] },
    });

    const firstPart = result.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData && part.inlineData.data) as
      | { inlineData?: { data: string; mimeType?: string } }
      | undefined;

    const mime = firstPart?.inlineData?.mimeType || "image/png";
    const data = firstPart?.inlineData?.data;
    const imageUrl = data ? `data:${mime};base64,${data}` : userImage;

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("background removal error", error);
    return NextResponse.json({ error: "배경 제거 중 오류가 발생했습니다." }, { status: 500 });
  }
}

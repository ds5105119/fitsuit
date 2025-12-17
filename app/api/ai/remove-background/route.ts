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
- The foreground subject is the person (head to toe). Everything else is background.

TASK
- Keep the person exactly as they are: same pose, body proportions, face, hair, and clothing.
- Remove 100% of the original background, including floor, walls, shadows on the floor or wall, furniture, text, logos, and any padding or empty areas.
- Create a new background behind the person and fill it with a single flat color: #f5f5f5.

HARD RULES
- Do NOT crop or cut off any part of the body (no missing feet, hands, or head).
- Do NOT keep, blend, or reuse any pixel from the original background.
- Any pixel that is not part of the person or their clothing must be exactly #f5f5f5.
- No gradients, no textures, no patterns, no glow, no vignette, no transparency.

FINAL CHECK
1) Background: every pixel that is not part of the person is exactly #f5f5f5.
2) Person: full body is visible from head to toe with no parts cut off.

If any background remains or any body part is missing, fix the image and only then return the final result.`;

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

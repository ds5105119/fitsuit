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

TASK
- Use ONLY the first inline image as the source.
- Keep the full person (head to toe) exactly as-is: pose, clothing, lighting, proportions.
- DELETE 100% of the original background.
- Create a NEW canvas behind the subject and fill the entire background with a flat solid color: #f5f5f5.

HARD RULES — NO EXCEPTIONS
- Do NOT crop out any body parts.
- Do NOT keep or blend any original background pixels.
- The new background must be a single flat color (#f5f5f5) with ZERO gradients, shadows, glows, patterns, or transparency.
- The ONLY non-#f5f5f5 pixels must belong to the person and what they are wearing.

FINAL CHECK
1) Is every background pixel exactly #f5f5f5?
2) Is the person fully intact with no missing limbs or cut-off feet/hands?
If not, fix it before returning the image.`;

    const ai = new GoogleGenAI({ apiKey });
    const contents: ContentListUnion = [{ inlineData: { data: userImage.split(",")[1] || "", mimeType: userImage.match(/data:(.*);base64/)?.[1] || "image/png" } }, { text: prompt }];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: { responseModalities: ["IMAGE"] },
    });

    const firstPart = result.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData && part.inlineData.data
    ) as { inlineData?: { data: string; mimeType?: string } } | undefined;

    const mime = firstPart?.inlineData?.mimeType || "image/png";
    const data = firstPart?.inlineData?.data;
    const imageUrl = data ? `data:${mime};base64,${data}` : userImage;

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("background removal error", error);
    return NextResponse.json({ error: "배경 제거 중 오류가 발생했습니다." }, { status: 500 });
  }
}

import { ContentListUnion, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_GENAI_API_KEY가 설정되지 않았습니다." }, { status: 400 });
  }

  try {
    const { selections, userImage } = await req.json();
    const summary = Object.values(selections || {})
      .map((s: any) => `${s.title}: ${s.subtitle}`)
      .join(", ");

    const prompt = `
    You are an image editor. Use the first inline image as the base person photo.

    - Completely remove and ignore ALL original background, borders, and padding from the input image (including any white bars or padding added to fit an aspect ratio). Only keep the person.
    - Keep the person's face, body, and pose exactly as in the reference (no changes to expression, hairstyle, body shape, or limb position).
    - Dress them in a tailored suit based on: ${summary}.
    - Shirt: crisp white. Tie: dark charcoal or navy. Suit: deep charcoal with subtle texture, with realistic fabric and folds aligned naturally to the body.
    - Rebuild the background from scratch as a flat, solid color #f5f5f5 that fills the entire canvas edge-to-edge.
    - There must be **no remaining white padding, borders, original background, gradients, shadows, glows, or transparent pixels.** Every pixel that is not part of the person must be exactly #f5f5f5.
    - If the input contains any white or blank areas around the person (from resizing or padding), treat them as background and overwrite them completely with #f5f5f5.

    Output a realistic photo-style render, with the suit aligned precisely to the body and all proportions kept natural.`;

    const ai = new GoogleGenAI({ apiKey });
    const contents: ContentListUnion = [];

    if (userImage && typeof userImage === "string" && userImage.startsWith("data:")) {
      const [meta, data] = userImage.split(",");
      const mimeMatch = meta.match(/data:(.*);base64/);
      const mimeType = mimeMatch?.[1] || "image/png";
      contents.push({ inlineData: { data, mimeType } });
    }
    contents.push({ text: prompt });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const firstPart = result.candidates?.[0]?.content?.parts?.[0] as { text?: string } | { inlineData?: { data: string; mimeType?: string } } | undefined;

    let imageUrl = "/images/suit1.png";
    if (firstPart && "inlineData" in firstPart && firstPart.inlineData?.data) {
      const mime = firstPart.inlineData.mimeType || "image/png";
      imageUrl = `data:${mime};base64,${firstPart.inlineData.data}`;
    } else if (firstPart && "text" in firstPart && firstPart.text) {
      imageUrl = firstPart.text;
    }

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("genai error", error);
    return NextResponse.json({ error: "AI 합성 중 오류가 발생했습니다.", imageUrl: "/images/suit1.png" }, { status: 500 });
  }
}

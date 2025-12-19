import { ContentListUnion, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_GENAI_API_KEY가 설정되지 않았습니다." }, { status: 400 });
  }

  try {
    const { selections, userImage } = await req.json();
    const summary = (selections || [])
      .map((s: any) => {
        const cat = s.category ? String(s.category) : "Selection";
        const group = s.group ? ` / ${s.group}` : "";
        return `${cat}${group}: ${s.title} - ${s.subtitle}`;
      })
      .join(", ");

    const prompt = `
You are an image editor and stylist.

TASK OVERVIEW
- Replace the person's clothing with a tailored suit that follows this description:
  ${summary}

- At the same time, you MUST COMPLETELY DELETE the original background and REPLACE it with a NEW flat background.

HARD RULE A — BACKGROUND REMOVAL (NO EXCEPTIONS)
- Use the first inline image ONLY as the base person photo.
- Keep ONLY the person: face, body, hair, hands, legs.
- Treat EVERY other pixel as background. This includes:
  - floor, wall, studio backdrop, furniture, room, sky,
  - white or black bars, padding, letterboxing, margins,
  - any logos, text, gradients, or graphics.
- You MUST NOT preserve, reuse, blend, or copy ANY part of the original background.
- If any original background remains visible in the result, the output is WRONG and must be fixed.

HARD RULE B — NEW BACKGROUND COLOR
- Create a new canvas behind the person.
- Fill the ENTIRE background with a flat solid color: #f5f5f5.
- Every pixel that is not part of the person or their clothing MUST be exactly #f5f5f5.
- The output must NOT contain:
  - pure white (#ffffff),
  - black,
  - gradients,
  - shadows,
  - glows,
  - vignettes,
  - patterns,
  - transparent pixels.
- The ONLY non-#f5f5f5 pixels in the image must belong to the person and their clothing.

CLOTHING RULE — SUIT DESIGN
- Replace the original clothing with a tailored suit that follows ${summary} as strictly as possible:
  - design and silhouette
  - lapel shape
  - closure type
  - EXACT number and layout of buttons
- Shirt: crisp white.
- Tie: dark charcoal or navy, unless ${summary} requires something else.
- Suit: deep charcoal with subtle texture, unless ${summary} specifies a different color or pattern.
- Fabric must look realistic, with natural folds aligned to the body.

FINAL CHECK (MANDATORY)
Before finalizing:
1) BACKGROUND:
   - Is 100% of the background a flat #f5f5f5 with NO leftover scenery, floor, wall, or padding?
2) SUIT DETAILS:
   - Does the suit match the constraints in ${summary}, especially button count, closure type, and color/pattern?

If any check fails, correct the image so that it fully follows the rules above.`;

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
      config: { responseModalities: ["IMAGE"] },
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

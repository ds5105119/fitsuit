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

    console.log(summary);

    const prompt = `
You are an image editor and stylist.

STEP 1 — Read style summary (HARD CONSTRAINTS)
- Carefully read this suit style description:
${summary}
- Treat every explicit detail in ${summary} as a HARD CONSTRAINT, not a suggestion.
- This includes, but is not limited to:
  - Number of buttons on the jacket (1, 2, 2.5, 4, 6, etc.)
  - Closure type (single-breasted or double-breasted)
  - Lapel style (notch, peak, shawl, etc.)
  - Suit color (e.g. charcoal, navy, black, grey, brown)
  - Pattern (e.g. solid, pinstripe, chalk stripe, windowpane, glen check, herringbone, houndstooth)
- If there is ANY conflict between ${summary} and any other instruction, ALWAYS follow ${summary} first.

STEP 2 — Remove original background COMPLETELY
- Use the first inline image ONLY as the base person photo.
- Isolate ONLY the person (face, body, hair, hands, legs). Treat everything else as background.
- Completely remove ALL original background, scenery, floor, walls, studio backdrops, furniture, sky, room, borders, or padding.
- This includes ANY white or black bars, padding, letterboxing, empty space, text, logos, or graphics.
- Do NOT preserve, reuse, blend, or copy ANY part of the original background or original canvas.

STEP 3 — Preserve the person exactly
- Keep the person’s face, body, proportions, and pose exactly as in the reference.
- Do NOT change the facial expression, hairstyle, body shape, or limb position.
- Only change the clothing according to the suit instructions.

STEP 4 — Dress them in the suit (FOLLOW HARD CONSTRAINTS)
- Dress the person in a tailored suit that matches ${summary} as closely as possible in:
  - design and silhouette,
  - lapel shape,
  - closure type,
  - and especially the EXACT number and arrangement of buttons.
- Shirt: crisp white.
- Tie: dark charcoal or navy, unless ${summary} explicitly requires a different tie style or color.
- Suit: deep charcoal with subtle texture, unless ${summary} explicitly specifies a different color or pattern. Fabric must look realistic, with natural folds aligned to the body.

STEP 5 — Create a NEW background from scratch
- Create a NEW empty canvas behind the person.
- Fill the ENTIRE background with a flat, solid color #f5f5f5 from edge to edge.
- The final background must be EXACTLY #f5f5f5 everywhere and nothing else:
  no white (#ffffff), no black, no gradients, no textures, no shadows, no glows, no vignettes, no patterns, and no transparent pixels.
- Any area that is not part of the person or clothing MUST be pure #f5f5f5.
- Do not keep any of the original background, padding, or borders, even partially.

STEP 6 — SELF-CHECK (VERY IMPORTANT)
Before finalizing the image, mentally go through this checklist:

1) BUTTON COUNT & CLOSURE
   - Does the jacket have the EXACT number of buttons specified in ${summary}?
   - Is the jacket correctly single-breasted or double-breasted as specified?
   - If ${summary} says 1-button, 2-button, 2.5-button, 4-button DB, 6-button DB, etc.,
     the front of the jacket MUST clearly show that exact configuration.

2) COLOR & PATTERN
   - Is the suit color (e.g. charcoal, navy, grey, black, brown) matching ${summary}?
   - Is the pattern (solid, pinstripe, chalk stripe, windowpane, glen check, herringbone, houndstooth, etc.)
     exactly as described in ${summary}, with the correct density and direction?

3) BACKGROUND
   - Is every background pixel exactly #f5f5f5 with NO leftover scenery, floor, wall, or padding?

If any of these checks fail, correct the image so that it strictly satisfies ${summary} and all constraints above.

FINAL OUTPUT
- Output a realistic photo-style render.
- The suit must be aligned precisely to the body with natural proportions.
- The suit design must clearly and exactly reflect the constraints in ${summary}, especially button count, closure type, color, and pattern.`;

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

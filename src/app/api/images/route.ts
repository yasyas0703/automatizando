import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { productImage, productName, variations } = await req.json();

    const results: string[] = [];

    for (const variation of variations) {
      const prompt = buildImagePrompt(productName, variation);
      console.log("Prompt imagem:", prompt.substring(0, 120) + "...");

      try {
        const imageBase64 = await generateImage(
          prompt,
          productImage || undefined,
          "image/png"
        );
        results.push(imageBase64);
      } catch (error) {
        console.error("Erro gerando variação:", error);
      }
    }

    return NextResponse.json({ images: results });
  } catch (error) {
    console.error("Erro ao gerar imagens:", error);
    const message = error instanceof Error ? error.message : "Erro ao gerar imagens";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildImagePrompt(
  productName: string,
  variation: { fundo: string; cor: string; estilo: string }
): string {
  // === FUNDOS ===
  const fundos: Record<string, string> = {
    branco: "pure white background, clean studio photography, bright even lighting",
    mesa_madeira: "on a light oak wooden table, warm natural lighting, cozy setting",
    mesa_marmore: "on a white marble surface, elegant and clean, soft reflections",
    mesa_escura: "on a dark black matte table, dramatic contrast, moody lighting",
    cenario_quarto: "on a bedroom nightstand, cozy bedroom background, warm ambient light",
    cenario_sala: "on a living room shelf, modern home interior, natural daylight",
    cenario_escritorio: "on a clean desk in a modern office, organized workspace, soft lighting",
    cenario_infantil: "in a colorful children's room, playful setting, bright cheerful lighting",
    natureza: "outdoor garden setting, natural greenery, soft sunlight, bokeh background",
    gradiente_azul: "smooth blue gradient background, professional studio, soft lighting",
    gradiente_rosa: "smooth pink gradient background, professional studio, soft lighting",
    gradiente_roxo: "smooth purple gradient background, professional studio, soft lighting",
    gradiente_neutro: "smooth gray to white gradient background, minimal and clean",
    neon: "colorful neon lights background, vibrant glowing colors, cyberpunk aesthetic",
    holografico: "holographic iridescent background, rainbow reflections, futuristic",
    preto: "pure black background, dramatic spot lighting, high contrast",
    pastel: "soft pastel colored background, gentle and calming, light and airy",
    textura_tecido: "on a linen fabric texture, soft and elegant, natural tones",
    textura_concreto: "on a concrete surface, industrial minimalist, urban aesthetic",
    papel_kraft: "on kraft brown paper, artisanal handmade feel, rustic setting",
  };

  // === ESTILOS ===
  const estilos: Record<string, string> = {
    principal: "centered product shot, perfectly framed, sharp focus on entire product",
    detalhe: "extreme close-up macro shot, showing fine print details and texture quality",
    angulo_45: "45 degree angle view, showing depth and three-dimensional form",
    angulo_cima: "top-down flat lay view, bird's eye perspective, perfectly arranged",
    angulo_baixo: "low angle heroic shot, looking up at the product, making it look impressive",
    lateral: "side profile view, clean silhouette, showing the shape and proportions",
    escala_mao: "being held in a human hand, showing real size reference, natural grip",
    escala_regua: "next to a ruler or measuring tape, clear size reference, informative",
    uso_real: "being used in its intended context, real life application, lifestyle usage",
    grupo: "multiple color variations displayed together, arranged in a pleasing pattern",
    embalagem: "product with packaging, gift-ready presentation, unboxing aesthetic",
    comparacao: "before and after comparison, or multiple versions side by side",
    "360": "multiple angle grid showing front, back, side and detail views in one image",
    artistico: "creative artistic composition, interesting shadows and lighting, editorial style",
    macro: "super macro close-up of surface texture, showing layer lines and material quality",
    flutuando: "product floating in mid-air, dynamic levitation effect, dramatic shadow below",
  };

  const fundoDesc = fundos[variation.fundo] || fundos.branco;
  const estiloDesc = estilos[variation.estilo] || estilos.principal;

  let prompt = `Professional e-commerce product photography of ${productName}, 3D printed object, high quality PLA material`;

  if (variation.cor && variation.cor !== "original") {
    prompt += `, ${variation.cor} color`;
  }

  prompt += `. ${fundoDesc}. ${estiloDesc}. High resolution, sharp, commercial quality, ready for marketplace listing.`;

  return prompt;
}

import { NextRequest, NextResponse } from "next/server";
import { generateText, generateFromImage } from "@/lib/gemini";

export const maxDuration = 60;

function tryParseJSON(text: string) {
  text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  let jsonStr = jsonMatch[0];

  try { return JSON.parse(jsonStr); } catch { /* continue */ }

  jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");
  // Fix newlines inside strings
  jsonStr = jsonStr.replace(/"((?:[^"\\]|\\.)*)"/g, (match) => {
    return match.replace(/(?<!\\)\n/g, "\\n");
  });

  try { return JSON.parse(jsonStr); } catch { /* continue */ }

  // Fallback: extract fields manually
  try {
    const titulo_shopee = text.match(/"titulo_shopee"\s*:\s*"((?:[^"\\]|\\.)*)"/)?.[1] || "";
    const titulo_ml = text.match(/"titulo_ml"\s*:\s*"((?:[^"\\]|\\.)*)"/)?.[1] || "";
    const titulo_tiktok = text.match(/"titulo_tiktok"\s*:\s*"((?:[^"\\]|\\.)*)"/)?.[1] || "";

    // For descricao, grab everything between the quotes more aggressively
    const descMatch = text.match(/"descricao"\s*:\s*"([\s\S]*?)"\s*,\s*"tags"/);
    const descricao = descMatch?.[1]?.replace(/\\n/g, "\n").replace(/\\"/g, '"') || "";

    const tagsMatch = text.match(/"tags"\s*:\s*\[([\s\S]*?)\]/);
    const tags = tagsMatch
      ? tagsMatch[1].match(/"([^"]+)"/g)?.map((t) => t.replace(/"/g, "")) || []
      : [];

    if (titulo_shopee || titulo_ml) {
      return { titulo_shopee, titulo_ml, titulo_tiktok, descricao, tags };
    }
  } catch { /* give up */ }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { nome, material, cor, tamanho, categoria, pesoGramas, precoVenda, productImage } = await req.json();

    const prompt = `Você é um copywriter EXPERT em marketplaces brasileiros. Você cria anúncios que VENDEM MUITO na Shopee, Mercado Livre e TikTok Shop.

PRODUTO:
- Nome: ${nome}
- Material: ${material}
- Cor: ${cor}
- Tamanho: ${tamanho || "não informado"}
- Categoria: ${categoria}
- Peso: ${pesoGramas}g
- Preço: R$ ${precoVenda || "não informado"}

Retorne APENAS JSON válido. Use \\n para quebras de linha dentro das strings. SEM markdown.

{
  "titulo_shopee": "titulo Shopee max 120 chars com palavras-chave fortes",
  "titulo_ml": "titulo Mercado Livre max 60 chars direto ao ponto",
  "titulo_tiktok": "titulo TikTok Shop max 100 chars chamativo e jovem",
  "descricao": "descricao COMPLETA e LONGA aqui (minimo 800 caracteres)",
  "tags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10"]
}

REGRAS PARA TITULOS:
- Shopee: use TODAS as palavras-chave possíveis, capitalize cada palavra. Ex: "Dragão Articulado Flexível Impressão 3D Decoração Geek Presente Criativo"
- Mercado Livre: mais curto e direto, profissional. Ex: "Dragão Articulado 3D Flexível 20cm Decorativo"
- TikTok: jovem, com emojis, chamativo. Ex: "Dragão Articulado que Mexe de Verdade 🐉 Impressão 3D"

REGRAS PARA DESCRIÇÃO (MUITO IMPORTANTE - faça LONGA e COMPLETA):
A descrição deve ter NO MÍNIMO 800 caracteres e incluir TODAS estas seções separadas por \\n\\n:

1. ABERTURA CHAMATIVA (2-3 linhas vendedoras com emojis)
2. SOBRE O PRODUTO (parágrafo detalhado explicando o que é, pra que serve, porque é especial)
3. CARACTERÍSTICAS com bullets usando ✅:\\n✅ Material: ${material} de alta qualidade\\n✅ Cor: ${cor}\\n✅ Tamanho: ${tamanho || "consulte"}\\n✅ Peso: ${pesoGramas}g\\n✅ Acabamento premium\\n✅ Produção artesanal
4. BENEFÍCIOS com bullets usando ⭐:\\n⭐ Presente perfeito\\n⭐ Decoração única\\n⭐ Produto exclusivo\\n⭐ Qualidade garantida
5. INFORMAÇÕES DE ENVIO: 📦 Enviamos para todo Brasil\\nProduto bem embalado com proteção
6. AVISO: ⚠️ Por ser produção artesanal em impressão 3D, pequenas variações são normais e tornam cada peça única.
7. HASHTAGS: #impressao3d #decoracao #geek #presente #artesanal

REGRAS PARA TAGS:
- 10 tags relevantes para busca
- Inclua: nome do produto, impressão 3D, decoração, presente, a categoria, material, geek, artesanal, etc.`;

    let text: string;

    if (productImage) {
      const visionPrompt = `Analise esta foto de um produto de impressão 3D. Identifique o que é, suas características visuais, cores, detalhes. Depois use essa análise para:\n\n${prompt}`;
      try {
        text = await generateFromImage(visionPrompt, productImage, "image/png");
      } catch {
        text = await generateText(prompt);
      }
    } else {
      text = await generateText(prompt);
    }

    console.log("Resposta Gemini (primeiros 500 chars):", text.substring(0, 500));

    const generated = tryParseJSON(text);
    if (!generated) {
      console.error("Não conseguiu parsear JSON da resposta");
      return NextResponse.json({ error: "IA retornou formato inválido. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json(generated);
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    const message = error instanceof Error ? error.message : "Erro ao gerar conteúdo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

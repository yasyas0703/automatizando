import { NextRequest, NextResponse } from "next/server";
import { createProduct, suggestCategory } from "@/lib/mercadolivre";
import { getMLToken } from "@/lib/token-store";

export async function POST(req: NextRequest) {
  const token = getMLToken();

  if (!token || !token.access_token) {
    return NextResponse.json(
      { error: "Não conectado ao Mercado Livre. Faça login primeiro." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { titulo, descricao, preco, pesoGramas, categoria, dimensoes, imagens } = body;

    // Tenta descobrir a melhor categoria pelo título
    let categoriaId = categoria;
    try {
      const sugestoes = await suggestCategory(titulo);
      if (sugestoes && sugestoes.length > 0) {
        categoriaId = sugestoes[0].category_id;
      }
    } catch {
      // Usa categoria padrão se não encontrar
    }

    const result = await createProduct(token.access_token, {
      titulo,
      descricao,
      preco,
      pesoGramas,
      categoria_id: categoriaId,
      dimensoes,
      imagens,
    });

    return NextResponse.json({
      success: true,
      id: result.id,
      permalink: result.permalink,
      message: `Produto criado com sucesso! ID: ${result.id}`,
    });
  } catch (error) {
    console.error("Erro ao publicar no ML:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao publicar" },
      { status: 500 }
    );
  }
}

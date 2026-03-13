import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pesoGramas } = await req.json();

  const filamentPricePerKg = Number(process.env.FILAMENT_PRICE_PER_KG) || 99;
  const custoEmbalagem = 3;
  const margemLucro = 0.65; // 65%
  const taxaPlataformaPercent = 0.20; // 20%

  const pesoKg = pesoGramas / 1000;
  const custoMaterial = pesoKg * filamentPricePerKg;
  const custoTotal = custoMaterial + custoEmbalagem;
  const lucroDesejado = custoTotal * margemLucro;
  const precoVenda = (custoTotal + lucroDesejado) / (1 - taxaPlataformaPercent);
  const taxaPlataforma = precoVenda * taxaPlataformaPercent;
  const lucro = precoVenda - custoTotal - taxaPlataforma;

  return NextResponse.json({
    custoMaterial: Math.round(custoMaterial * 100) / 100,
    custoEmbalagem,
    custoTotal: Math.round(custoTotal * 100) / 100,
    taxaPlataforma: Math.round(taxaPlataforma * 100) / 100,
    lucro: Math.round(lucro * 100) / 100,
    precoVenda: Math.round(precoVenda * 100) / 100,
    pesoKg: Math.round(pesoKg * 1000) / 1000,
  });
}

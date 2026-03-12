import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pesoGramas } = await req.json();

  const filamentPricePerKg = Number(process.env.FILAMENT_PRICE_PER_KG) || 99;
  const profitMargin = Number(process.env.PROFIT_MARGIN) || 1.7;

  const pesoKg = pesoGramas / 1000;
  const custoMaterial = pesoKg * filamentPricePerKg;
  const precoVenda = custoMaterial * profitMargin;
  const lucro = precoVenda - custoMaterial;

  return NextResponse.json({
    custoMaterial: Math.round(custoMaterial * 100) / 100,
    precoVenda: Math.round(precoVenda * 100) / 100,
    lucro: Math.round(lucro * 100) / 100,
    pesoKg: Math.round(pesoKg * 1000) / 1000,
  });
}

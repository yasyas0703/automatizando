import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pesoGramas } = await req.json();

  const filamentPricePerKg = Number(process.env.FILAMENT_PRICE_PER_KG) || 99;
  const custoEmbalagem = 3;
  const taxaFixaShopee = 4;
  const comissaoShopee = 0.20; // 20%
  const ads = 0.05; // 5%
  const totalPercentual = comissaoShopee + ads; // 25%

  const pesoKg = pesoGramas / 1000;
  const custoMaterial = pesoKg * filamentPricePerKg;
  const custoBase = custoMaterial + custoEmbalagem + taxaFixaShopee;

  // Lucro 50%
  const lucro50 = custoBase * 0.50;
  const preco50 = (custoBase + lucro50) / (1 - totalPercentual);

  // Lucro 70%
  const lucro70 = custoBase * 0.70;
  const preco70 = (custoBase + lucro70) / (1 - totalPercentual);

  // Preço mínimo (0 a 0)
  const precoMinimo = custoBase / (1 - totalPercentual);

  return NextResponse.json({
    custoMaterial: Math.round(custoMaterial * 100) / 100,
    custoEmbalagem,
    taxaFixaShopee,
    custoBase: Math.round(custoBase * 100) / 100,
    preco50: Math.round(preco50 * 100) / 100,
    preco70: Math.round(preco70 * 100) / 100,
    lucro50: Math.round(lucro50 * 100) / 100,
    lucro70: Math.round(lucro70 * 100) / 100,
    precoMinimo: Math.round(precoMinimo * 100) / 100,
    pesoKg: Math.round(pesoKg * 1000) / 1000,
  });
}

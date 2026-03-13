export interface ProductForm {
  nome: string;
  material: string;
  cor: string;
  tamanho: string;
  pesoGramas: number;
  categoria: string;
  estiloImagem: string;
}

export interface PriceCalculation {
  custoMaterial: number;
  custoEmbalagem: number;
  taxaFixaShopee: number;
  custoBase: number;
  preco50: number;
  preco70: number;
  lucro50: number;
  lucro70: number;
  precoMinimo: number;
  pesoKg: number;
}

export interface GeneratedProduct {
  titulo: string;
  descricao: string;
  tags: string[];
  preco: PriceCalculation;
  imagens: string[]; // base64 or URLs
}

export const CATEGORIAS = [
  "Decoração",
  "Brinquedos",
  "Utilidades",
  "Organizadores",
  "Miniaturas",
  "Chaveiros",
  "Vasos",
  "Luminárias",
  "Suportes",
  "Outros",
];

export const MATERIAIS = ["PLA", "PETG", "ABS", "TPU", "Resina"];

export const CORES = [
  "Preto",
  "Branco",
  "Vermelho",
  "Azul",
  "Verde",
  "Amarelo",
  "Rosa",
  "Roxo",
  "Laranja",
  "Cinza",
  "Transparente",
  "Multicolorido",
];

export const ESTILOS_IMAGEM = [
  "Fundo branco (produto)",
  "Cenário lifestyle",
  "Mesa de madeira",
  "Fundo gradiente",
  "Minimalista",
];

export const VARIACOES_SAQUINHO = [
  { id: "15x20", label: "15x20" },
  { id: "19x25", label: "19x25" },
];

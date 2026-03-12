export interface ProductForm {
  nome: string;
  material: string;
  cor: string;
  tamanho: string;
  pesoGramas: number;
  categoria: string;
  estiloImagem: string;
  templatePacote: "pequeno" | "medio" | "grande";
}

export interface PriceCalculation {
  custoMaterial: number;
  precoVenda: number;
  lucro: number;
  pesoKg: number;
}

export interface GeneratedProduct {
  titulo: string;
  descricao: string;
  tags: string[];
  preco: PriceCalculation;
  imagens: string[]; // base64 or URLs
  dimensoesPacote: { largura: number; altura: number; profundidade: number };
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

export const TEMPLATES_PACOTE = {
  pequeno: { largura: 20, altura: 15, profundidade: 10 },
  medio: { largura: 25, altura: 20, profundidade: 15 },
  grande: { largura: 30, altura: 25, profundidade: 20 },
};

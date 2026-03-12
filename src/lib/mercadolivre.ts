const ML_API = "https://api.mercadolibre.com";
const ML_AUTH = "https://auth.mercadolivre.com.br";

export function getAuthUrl() {
  const clientId = process.env.ML_CLIENT_ID!;
  const redirectUri = process.env.ML_REDIRECT_URI!;
  return `${ML_AUTH}/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

export async function exchangeCode(code: string) {
  const res = await fetch(`${ML_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.ML_CLIENT_ID,
      client_secret: process.env.ML_CLIENT_SECRET,
      code,
      redirect_uri: process.env.ML_REDIRECT_URI,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erro ao trocar código: ${err}`);
  }

  return await res.json();
}

export async function refreshToken(refreshToken: string) {
  const res = await fetch(`${ML_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: process.env.ML_CLIENT_ID,
      client_secret: process.env.ML_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erro ao renovar token: ${err}`);
  }

  return await res.json();
}

export async function getUserInfo(accessToken: string) {
  const res = await fetch(`${ML_API}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return await res.json();
}

interface MLProductData {
  titulo: string;
  descricao: string;
  preco: number;
  pesoGramas: number;
  categoria_id: string;
  dimensoes: { largura: number; altura: number; profundidade: number };
  imagens?: string[]; // URLs das imagens
}

export async function createProduct(accessToken: string, data: MLProductData) {
  const body: Record<string, unknown> = {
    title: data.titulo,
    category_id: data.categoria_id,
    price: data.preco,
    currency_id: "BRL",
    available_quantity: 1,
    buying_mode: "buy_it_now",
    listing_type_id: "gold_special",
    condition: "new",
    description: {
      plain_text: data.descricao,
    },
    shipping: {
      mode: "me2",
      local_pick_up: false,
      free_shipping: false,
      dimensions: `${data.dimensoes.largura}x${data.dimensoes.altura}x${data.dimensoes.profundidade},${data.pesoGramas}`,
    },
  };

  // Se tiver imagens (URLs), adiciona
  if (data.imagens && data.imagens.length > 0) {
    body.pictures = data.imagens.map((url) => ({ source: url }));
  }

  const res = await fetch(`${ML_API}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(`Erro ao criar produto: ${JSON.stringify(result)}`);
  }

  return result;
}

// Busca categorias sugeridas pelo ML baseado no título
export async function suggestCategory(title: string) {
  const res = await fetch(
    `${ML_API}/sites/MLB/domain_discovery/search?q=${encodeURIComponent(title)}`
  );
  return await res.json();
}

// Busca categorias predefinidas para impressão 3D
export const ML_CATEGORIAS_3D: Record<string, string> = {
  "Decoração": "MLB1574", // Casa, Móveis e Decoração
  "Brinquedos": "MLB1132", // Brinquedos e Hobbies
  "Utilidades": "MLB1574",
  "Organizadores": "MLB1574",
  "Miniaturas": "MLB1132",
  "Chaveiros": "MLB1081", // Acessórios para Veículos (chaveiros)
  "Vasos": "MLB1574",
  "Luminárias": "MLB1574",
  "Suportes": "MLB1000", // Eletrônicos
  "Outros": "MLB1574",
};

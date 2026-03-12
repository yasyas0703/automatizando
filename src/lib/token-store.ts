// Token storage em memória (singleton)
// Em produção, migre para banco de dados (SQLite, Redis, etc.)

export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  nickname: string;
}

let mlToken: TokenData | null = null;

export function setMLToken(data: TokenData | null) {
  mlToken = data;
}

export function getMLToken(): TokenData | null {
  return mlToken;
}

export function isMLConnected(): boolean {
  return mlToken !== null && mlToken.expires_at > Date.now();
}

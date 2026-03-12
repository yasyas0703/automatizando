import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, getUserInfo } from "@/lib/mercadolivre";
import { setMLToken } from "@/lib/token-store";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
  }

  try {
    const tokens = await exchangeCode(code);
    const user = await getUserInfo(tokens.access_token);

    setMLToken({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
      user_id: user.id?.toString() || "",
      nickname: user.nickname || "",
    });

    return NextResponse.redirect(new URL("/?ml_connected=true", req.url));
  } catch (error) {
    console.error("Erro no callback ML:", error);
    return NextResponse.redirect(new URL("/?ml_error=true", req.url));
  }
}

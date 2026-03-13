import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const token = await authenticate(email, password);
    if (!token) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Erro no login" }, { status: 500 });
  }
}

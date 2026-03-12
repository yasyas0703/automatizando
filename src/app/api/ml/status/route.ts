import { NextResponse } from "next/server";
import { getMLToken } from "@/lib/token-store";

export async function GET() {
  const token = getMLToken();

  if (!token) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    nickname: token.nickname,
    user_id: token.user_id,
    expires_at: token.expires_at,
  });
}

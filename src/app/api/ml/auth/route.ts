import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/mercadolivre";

export async function GET() {
  const url = getAuthUrl();
  return NextResponse.json({ url });
}

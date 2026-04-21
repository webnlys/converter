import { NextResponse } from "next/server";
import { db } from "@/lib/db/fileDb";

export async function GET(request: Request) {
  db.init();
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10) || 10, 1), 100);
  const conversions = db.getRecentConversions(limit);
  return NextResponse.json({
    success: true,
    conversions,
    count: conversions.length,
    timestamp: new Date().toISOString(),
  });
}

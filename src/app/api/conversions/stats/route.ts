import { NextResponse } from "next/server";
import { db } from "@/lib/db/fileDb";

export async function GET() {
  db.init();
  const stats = db.getStats();
  return NextResponse.json({
    success: true,
    stats,
    timestamp: new Date().toISOString(),
  });
}

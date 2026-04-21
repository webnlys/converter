import { NextResponse } from "next/server";
import { db } from "@/lib/db/fileDb";

export async function GET() {
  db.init();
  const count = db.getConversionCount();
  return NextResponse.json({
    success: true,
    count,
    timestamp: new Date().toISOString(),
  });
}

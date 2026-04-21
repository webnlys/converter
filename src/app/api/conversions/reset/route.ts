import { NextResponse } from "next/server";
import { db } from "@/lib/db/fileDb";

export async function POST() {
  db.init();
  db.resetCounter();
  return NextResponse.json({
    success: true,
    count: 0,
    message: "Conversion counter has been reset",
    timestamp: new Date().toISOString(),
  });
}

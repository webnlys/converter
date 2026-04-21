import { NextResponse } from "next/server";
import { db } from "@/lib/db/fileDb";

export async function POST(request: Request) {
  db.init();

  let body: { amount?: string; english?: string; bangla?: string } = {};
  try {
    const text = await request.text();
    if (text.trim()) {
      body = JSON.parse(text);
    }
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { amount, english, bangla } = body;
  let count: number;

  if (amount != null && english != null && bangla != null) {
    db.addConversionRecord({ amount, english, bangla });
    count = db.getConversionCount();
  } else {
    count = db.incrementConversionCount();
  }

  return NextResponse.json({
    success: true,
    count,
    timestamp: new Date().toISOString(),
  });
}

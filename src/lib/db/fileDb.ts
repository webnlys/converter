/**
 * File-based database (JSON) under `.data/` at the project root.
 * Used by Next.js Route Handlers for conversion analytics.
 */

import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), ".data");
const CONVERSIONS_FILE = path.join(DB_DIR, "conversions.json");

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function initializeDb() {
  ensureDbDir();

  if (!fs.existsSync(CONVERSIONS_FILE)) {
    const initialData = {
      totalConversions: 0,
      conversions: [] as unknown[],
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(CONVERSIONS_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readData(): {
  totalConversions: number;
  conversions: unknown[];
  lastUpdated: string;
} {
  try {
    ensureDbDir();
    if (!fs.existsSync(CONVERSIONS_FILE)) {
      initializeDb();
    }
    const data = fs.readFileSync(CONVERSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return {
      totalConversions: 0,
      conversions: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

function writeData(data: {
  totalConversions: number;
  conversions: unknown[];
  lastUpdated: string;
}) {
  try {
    ensureDbDir();
    fs.writeFileSync(CONVERSIONS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

export const db = {
  init() {
    initializeDb();
  },

  getConversionCount(): number {
    const data = readData();
    return data.totalConversions || 0;
  },

  incrementConversionCount(): number {
    const data = readData();
    data.totalConversions = (data.totalConversions || 0) + 1;
    data.lastUpdated = new Date().toISOString();
    writeData(data);
    return data.totalConversions;
  },

  addConversionRecord(record: { amount: string; english: string; bangla: string; timestamp?: string }) {
    const data = readData();
    const newRecord = {
      ...record,
      timestamp: record.timestamp || new Date().toISOString(),
      id: `conversion_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    };

    data.conversions = data.conversions || [];
    (data.conversions as unknown[]).push(newRecord);

    if (data.conversions.length > 1000) {
      data.conversions = data.conversions.slice(-1000);
    }

    data.totalConversions = (data.totalConversions || 0) + 1;
    data.lastUpdated = new Date().toISOString();
    writeData(data);

    return newRecord;
  },

  getRecentConversions(limit: number = 10) {
    const data = readData();
    const conversions = data.conversions || [];
    return conversions.slice(-limit).reverse();
  },

  getAllConversions() {
    const data = readData();
    return data.conversions || [];
  },

  resetCounter() {
    const data = readData();
    data.totalConversions = 0;
    data.conversions = [];
    data.lastUpdated = new Date().toISOString();
    writeData(data);
    return 0;
  },

  getStats() {
    const data = readData();
    return {
      totalConversions: data.totalConversions || 0,
      totalRecords: (data.conversions || []).length,
      lastUpdated: data.lastUpdated,
    };
  },
};

export default db;

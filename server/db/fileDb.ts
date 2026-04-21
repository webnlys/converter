/**
 * File-based Database System
 * Provides persistent data storage using JSON files
 * Suitable for small to medium applications
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database directory
const DB_DIR = path.join(__dirname, '..', '..', '.data');
const CONVERSIONS_FILE = path.join(DB_DIR, 'conversions.json');

// Ensure database directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// Initialize database file if it doesn't exist
function initializeDb() {
  ensureDbDir();
  
  if (!fs.existsSync(CONVERSIONS_FILE)) {
    const initialData = {
      totalConversions: 0,
      conversions: [],
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(CONVERSIONS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read data from file
function readData() {
  try {
    ensureDbDir();
    if (!fs.existsSync(CONVERSIONS_FILE)) {
      initializeDb();
    }
    const data = fs.readFileSync(CONVERSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {
      totalConversions: 0,
      conversions: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Write data to file
function writeData(data: any) {
  try {
    ensureDbDir();
    fs.writeFileSync(CONVERSIONS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// Database operations
export const db = {
  // Initialize database
  init() {
    initializeDb();
  },

  // Get total conversion count
  getConversionCount(): number {
    const data = readData();
    return data.totalConversions || 0;
  },

  // Increment conversion counter
  incrementConversionCount(): number {
    const data = readData();
    data.totalConversions = (data.totalConversions || 0) + 1;
    data.lastUpdated = new Date().toISOString();
    writeData(data);
    return data.totalConversions;
  },

  // Add conversion record
  addConversionRecord(record: {
    amount: string;
    english: string;
    bangla: string;
    timestamp?: string;
  }) {
    const data = readData();
    const newRecord = {
      ...record,
      timestamp: record.timestamp || new Date().toISOString(),
      id: `conversion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    data.conversions = data.conversions || [];
    data.conversions.push(newRecord);
    
    // Keep only last 1000 records to prevent file from getting too large
    if (data.conversions.length > 1000) {
      data.conversions = data.conversions.slice(-1000);
    }
    
    data.totalConversions = (data.totalConversions || 0) + 1;
    data.lastUpdated = new Date().toISOString();
    writeData(data);
    
    return newRecord;
  },

  // Get recent conversions
  getRecentConversions(limit: number = 10) {
    const data = readData();
    const conversions = data.conversions || [];
    return conversions.slice(-limit).reverse();
  },

  // Get all conversion records
  getAllConversions() {
    const data = readData();
    return data.conversions || [];
  },

  // Reset counter
  resetCounter() {
    const data = readData();
    data.totalConversions = 0;
    data.conversions = [];
    data.lastUpdated = new Date().toISOString();
    writeData(data);
    return 0;
  },

  // Get database stats
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

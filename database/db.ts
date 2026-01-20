import * as SQLite from 'expo-sqlite';

/**
 * Type ของข้อมูลในตาราง
 */
export interface ScanHistory {
  id: number;
  type: string;
  createdAt: string;
}

/**
 * เปิด database (API ใหม่)
 */
export const db = SQLite.openDatabaseSync('waste.db');

/**
 * init database (create table)
 */
export const initDB = (): void => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS scan_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
};

/**
 * insert scan result
 */
export const insertScan = (type: string): void => {
  const now = new Date();
  const localDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
  
  db.runSync(
    `INSERT INTO scan_history (type, createdAt)
     VALUES (?, ?)`,
    [type, localDateTime]
  );
};

/**
 * fetch scan history
 */
export const fetchHistory = (): ScanHistory[] => {
  const result = db.getAllSync<ScanHistory>(
    `SELECT * FROM scan_history ORDER BY createdAt DESC`
  );
  return result;
};

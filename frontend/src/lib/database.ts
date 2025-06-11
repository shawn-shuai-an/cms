import mysql from 'mysql2/promise';

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'cms_user',
  password: process.env.DB_PASSWORD || 'cms_password_123',
  database: process.env.DB_NAME || 'cms_db',
  charset: 'utf8mb4',
};

let connection: mysql.Connection | null = null;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
}

export async function query(sql: string, params: any[] = []) {
  const conn = await getConnection();
  const [results] = await conn.execute(sql, params);
  return results as any[];
}

export async function queryOne(sql: string, params: any[] = []) {
  const results = await query(sql, params);
  return results[0] || null;
} 
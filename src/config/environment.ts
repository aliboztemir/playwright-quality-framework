import * as dotenv from 'dotenv';

dotenv.config();

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function optionalEnvInt(key: string, fallback: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : fallback;
}

export const environment = {
  odooUrl:       optionalEnv('ODOO_URL',  'http://localhost:8069'),
  shopUrl:       optionalEnv('SHOP_URL',  'http://localhost:8069/shop'),
  adminUrl:      optionalEnv('ADMIN_URL', 'http://localhost:8069/web#action='),
  dbHost:        optionalEnv('DB_HOST',     'localhost'),
  dbPort:        optionalEnvInt('DB_PORT',  5432),
  dbName:        optionalEnv('DB_NAME',     'odoo'),
  dbUser:        optionalEnv('DB_USER',     'odoo'),
  dbPassword:    optionalEnv('DB_PASSWORD', 'odoo_password'),
  adminEmail:    optionalEnv('ADMIN_EMAIL',    'admin'),
  adminPassword: optionalEnv('ADMIN_PASSWORD', 'admin'),
} as const;

import { neon, NeonQueryFunction } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

const SCHEMA_STATEMENTS = [
  `create table if not exists users (
    id serial primary key,
    email text unique not null,
    password_hash text,
    email_verified boolean not null default false,
    created_at timestamptz default now()
  )`,
  `create table if not exists verification_codes (
    email text primary key,
    code text not null,
    expires_at timestamptz not null
  )`,
  `create table if not exists password_setup_tokens (
    token text primary key,
    email text not null,
    expires_at timestamptz not null,
    used boolean not null default false
  )`,
  // Migrate tables created by the earlier single-step signup version.
  `alter table users add column if not exists email_verified boolean not null default false`,
  `alter table users alter column password_hash drop not null`,
];

export async function ensureSchema(sql: NeonQueryFunction<false, false>) {
  for (const statement of SCHEMA_STATEMENTS) {
    await sql.query(statement);
  }
}

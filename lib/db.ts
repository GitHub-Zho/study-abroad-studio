import { neon } from "@neondatabase/serverless";

// Set once a Postgres database is provisioned (`vercel install neon`),
// which wires DATABASE_URL into the project automatically.
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export const USERS_TABLE_SQL = `
create table if not exists users (
  id serial primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);
`;

import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const sql = getDb();
  if (!sql) {
    return Response.json({ error: "服务尚未配置完成" }, { status: 503 });
  }

  const { token, password } = await request.json();
  if (typeof token !== "string" || typeof password !== "string" || password.length < 8) {
    return Response.json({ error: "请填写至少8位的密码" }, { status: 400 });
  }

  const rows = await sql`
    select email, expires_at, used from password_setup_tokens where token = ${token}
  `;
  if (rows.length === 0) {
    return Response.json({ error: "链接无效，请重新注册" }, { status: 400 });
  }
  const row = rows[0];
  if (row.used) {
    return Response.json({ error: "这个链接已经用过了，请直接登录" }, { status: 400 });
  }
  if (new Date(row.expires_at as string) < new Date()) {
    return Response.json({ error: "链接已过期，请重新注册" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await sql`update users set password_hash = ${hash} where email = ${row.email}`;
  await sql`update password_setup_tokens set used = true where token = ${token}`;

  return Response.json({ ok: true });
}

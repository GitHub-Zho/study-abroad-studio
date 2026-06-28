import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const sql = getDb();
  if (!sql) {
    return Response.json(
      { error: "账号系统还没配置好，暂时无法登录（缺少数据库）" },
      { status: 503 }
    );
  }

  const { email, password } = await request.json();
  if (typeof email !== "string" || typeof password !== "string") {
    return Response.json({ error: "请填写邮箱和密码" }, { status: 400 });
  }

  const rows = await sql`select password_hash from users where email = ${email}`;
  if (rows.length === 0) {
    return Response.json({ error: "邮箱或密码不正确" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, rows[0].password_hash as string);
  if (!ok) {
    return Response.json({ error: "邮箱或密码不正确" }, { status: 401 });
  }

  return Response.json({ ok: true });
}

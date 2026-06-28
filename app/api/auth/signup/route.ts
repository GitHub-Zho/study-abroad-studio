import bcrypt from "bcryptjs";
import { getDb, USERS_TABLE_SQL } from "@/lib/db";

export async function POST(request: Request) {
  const sql = getDb();
  if (!sql) {
    return Response.json(
      { error: "账号系统还没配置好，暂时无法注册（缺少数据库）" },
      { status: 503 }
    );
  }

  const { email, password } = await request.json();
  if (typeof email !== "string" || typeof password !== "string" || password.length < 6) {
    return Response.json({ error: "请填写有效邮箱和至少6位的密码" }, { status: 400 });
  }

  await sql.query(USERS_TABLE_SQL);

  const existing = await sql`select id from users where email = ${email}`;
  if (existing.length > 0) {
    return Response.json({ error: "这个邮箱已经注册过了，请直接登录" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  await sql`insert into users (email, password_hash) values (${email}, ${hash})`;

  return Response.json({ ok: true });
}

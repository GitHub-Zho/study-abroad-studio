import { randomBytes } from "crypto";
import { getDb } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/resend";

export async function POST(request: Request) {
  const sql = getDb();
  const resend = getResend();
  if (!sql || !resend) {
    return Response.json({ error: "服务尚未配置完成，暂时无法注册" }, { status: 503 });
  }

  const { email, code } = await request.json();
  if (typeof email !== "string" || typeof code !== "string") {
    return Response.json({ error: "请填写邮箱和验证码" }, { status: 400 });
  }

  const rows = await sql`
    select code, expires_at from verification_codes where email = ${email}
  `;
  if (rows.length === 0) {
    return Response.json({ error: "请先获取验证码" }, { status: 400 });
  }
  if (new Date(rows[0].expires_at as string) < new Date()) {
    return Response.json({ error: "验证码已过期，请重新获取" }, { status: 400 });
  }
  if (rows[0].code !== code) {
    return Response.json({ error: "验证码不正确" }, { status: 400 });
  }

  // Code is correct — preliminary registration: mark email verified, clear the code.
  await sql`
    insert into users (email, email_verified)
    values (${email}, true)
    on conflict (email) do update set email_verified = true
  `;
  await sql`delete from verification_codes where email = ${email}`;

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await sql`
    insert into password_setup_tokens (token, email, expires_at)
    values (${token}, ${email}, ${expiresAt})
  `;

  const origin = new URL(request.url).origin;
  const link = `${origin}/set-password?token=${token}`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "完成注册 · 超级无敌厉害留学咨询工作室",
    text: `验证已通过，欢迎加入。\n\n点击下面的链接设置你的密码，完成注册：\n${link}\n\n链接24小时内有效。`,
  });

  return Response.json({ ok: true });
}

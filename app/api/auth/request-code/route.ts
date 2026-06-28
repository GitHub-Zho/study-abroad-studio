import { getDb, ensureSchema, RESEND_COOLDOWN_SECONDS } from "@/lib/db";
import { getResend, FROM_ADDRESS, emailLayout } from "@/lib/resend";

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const sql = getDb();
  const resend = getResend();
  if (!sql || !resend) {
    return Response.json({ error: "服务尚未配置完成，暂时无法注册" }, { status: 503 });
  }

  const { email } = await request.json();
  if (!isValidEmail(email)) {
    return Response.json({ error: "请填写有效的邮箱地址" }, { status: 400 });
  }

  await ensureSchema(sql);

  const existing = await sql`select email_verified, password_hash from users where email = ${email}`;
  if (existing.length > 0 && existing[0].password_hash) {
    return Response.json({ error: "这个邮箱已经注册过了，请直接登录" }, { status: 409 });
  }

  const recent = await sql`select last_sent_at from verification_codes where email = ${email}`;
  if (recent.length > 0) {
    const secondsSince = (Date.now() - new Date(recent[0].last_sent_at as string).getTime()) / 1000;
    if (secondsSince < RESEND_COOLDOWN_SECONDS) {
      return Response.json(
        { error: `请求太频繁，请${Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSince)}秒后再试` },
        { status: 429 }
      );
    }
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await sql`
    insert into verification_codes (email, code, expires_at, attempts, last_sent_at)
    values (${email}, ${code}, ${expiresAt}, 0, now())
    on conflict (email) do update set code = excluded.code, expires_at = excluded.expires_at, attempts = 0, last_sent_at = now()
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "你的验证码 · 超级无敌厉害留学咨询工作室",
      text: `你的验证码是：${code}\n\n10分钟内有效，请勿告诉他人。`,
      html: emailLayout(`
        <p style="margin:0 0 16px;">你的验证码是：</p>
        <p style="text-align:center;margin:0 0 16px;">
          <span style="display:inline-block;font-size:28px;font-weight:500;letter-spacing:6px;color:#c9a227;">${code}</span>
        </p>
        <p style="margin:0;color:#9fb0c5;font-size:12px;">10分钟内有效，请勿告诉他人。</p>
      `),
    });
    if (result.error) {
      console.error("Resend rejected verification code email", result.error);
      return Response.json({ error: "邮件发送失败，请稍后重试" }, { status: 502 });
    }
  } catch (err) {
    console.error("Failed to send verification code email", err);
    return Response.json({ error: "邮件发送失败，请稍后重试" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

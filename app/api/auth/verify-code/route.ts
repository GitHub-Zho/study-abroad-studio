import { randomBytes, timingSafeEqual } from "crypto";
import { getDb, MAX_CODE_ATTEMPTS } from "@/lib/db";
import { getResend, FROM_ADDRESS, emailLayout } from "@/lib/resend";
import { getAppUrl } from "@/lib/url";

function codesMatch(a: string, b: string) {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

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
    select code, expires_at, attempts from verification_codes where email = ${email}
  `;
  if (rows.length === 0) {
    return Response.json({ error: "请先获取验证码" }, { status: 400 });
  }
  if (new Date(rows[0].expires_at as string) < new Date()) {
    return Response.json({ error: "验证码已过期，请重新获取" }, { status: 400 });
  }
  if ((rows[0].attempts as number) >= MAX_CODE_ATTEMPTS) {
    return Response.json({ error: "尝试次数太多，请重新获取验证码" }, { status: 429 });
  }
  if (!codesMatch(rows[0].code as string, code)) {
    await sql`update verification_codes set attempts = attempts + 1 where email = ${email}`;
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

  const link = `${getAppUrl()}/set-password?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "完成注册 · 超级无敌厉害留学咨询工作室",
      text: `验证已通过，欢迎加入。\n\n点击下面的链接设置你的密码，完成注册：\n${link}\n\n链接24小时内有效。`,
      html: emailLayout(`
        <p style="margin:0 0 16px;">验证已通过，欢迎加入。</p>
        <p style="margin:0 0 20px;">点击下面的按钮设置你的密码，完成注册：</p>
        <p style="text-align:center;margin:0 0 20px;">
          <a href="${link}" style="display:inline-block;background:#c9a227;color:#0a1d35;text-decoration:none;font-weight:500;padding:12px 28px;border-radius:4px;">设置密码</a>
        </p>
        <p style="margin:0;color:#9fb0c5;font-size:12px;">如果按钮无法点击，复制这个链接到浏览器打开：<br>${link}</p>
        <p style="margin:12px 0 0;color:#9fb0c5;font-size:12px;">链接24小时内有效。</p>
      `),
    });
    if (result.error) {
      console.error("Resend rejected registration email", result.error);
      return Response.json(
        { error: "验证成功，但邮件发送失败，请稍后重新注册一次" },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Failed to send registration email", err);
    return Response.json(
      { error: "验证成功，但邮件发送失败，请稍后重新注册一次" },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}

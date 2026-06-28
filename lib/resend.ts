import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const RAW_FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
export const FROM_ADDRESS = `超级无敌厉害留学咨询工作室 <${RAW_FROM}>`;

export function emailLayout(bodyHtml: string) {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:32px 16px;background:#0a1d35;font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;">
  <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;">
    <tr><td style="text-align:center;padding-bottom:20px;">
      <span style="font-size:11px;letter-spacing:3px;color:#c9a227;text-transform:uppercase;">出国留学 · 精品申请工作室</span>
    </td></tr>
    <tr><td style="border-top:1px solid rgba(201,162,39,0.5);padding-top:24px;color:#f3ead9;font-size:14px;line-height:1.8;">
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding-top:32px;text-align:center;">
      <span style="font-size:11px;color:#9fb0c5;">如果这不是你本人的操作，忽略这封邮件即可，不会有任何影响。</span>
    </td></tr>
  </table>
</body></html>`;
}

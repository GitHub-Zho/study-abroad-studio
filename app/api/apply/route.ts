import { Resend } from "resend";

interface ApplyPayload {
  nickname: string;
  contact: string;
  email: string;
  gpa: string;
  target: string;
  services: string[];
  about: string;
  referral: string;
}

function isValidPayload(body: unknown): body is ApplyPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.nickname === "string" &&
    b.nickname.trim().length > 0 &&
    typeof b.contact === "string" &&
    b.contact.trim().length > 0 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.gpa === "string" &&
    typeof b.target === "string" &&
    Array.isArray(b.services) &&
    typeof b.about === "string" &&
    typeof b.referral === "string"
  );
}

function renderSummary(data: ApplyPayload): string {
  return [
    `称呼：${data.nickname}`,
    `联系方式：${data.contact}`,
    `邮箱：${data.email}`,
    `GPA：${data.gpa}`,
    `目标方向：${data.target}`,
    `希望服务：${data.services.join("、") || "（未选择）"}`,
    `自我介绍：${data.about || "（未填写）"}`,
    `推荐来源：${data.referral || "（未填写）"}`,
  ].join("\n");
}

async function saveToGitHub(data: ApplyPayload) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "GitHub-Zho/study-abroad-studio"
  if (!token || !repo) {
    console.warn("GITHUB_TOKEN / GITHUB_REPO not set, skipping persistence");
    return;
  }

  const timestamp = new Date().toISOString();
  const path = `submissions/${timestamp.replace(/[:.]/g, "-")}.json`;
  const content = Buffer.from(
    JSON.stringify({ ...data, submittedAt: timestamp }, null, 2)
  ).toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `New application: ${data.nickname}`,
        content,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub persistence failed: ${res.status} ${errText}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式不正确" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json({ error: "请完整填写必填项" }, { status: 400 });
  }

  const data = body;
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!resendKey || !adminEmail) {
    return Response.json(
      { error: "服务尚未配置完成（缺少邮件服务密钥）" },
      { status: 500 }
    );
  }

  const resend = new Resend(resendKey);
  const summary = renderSummary(data);

  try {
    await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      subject: `新申请意向：${data.nickname}`,
      text: summary,
    });

    await resend.emails.send({
      from: fromAddress,
      to: data.email,
      subject: "已收到你的申请意向 · 超级无敌厉害留学咨询工作室",
      text: `你好 ${data.nickname}，\n\n我们已经收到你的申请意向，会在一周之内联系你。\n\n以下是你填写的内容：\n\n${summary}\n\n超级无敌厉害留学咨询工作室`,
    });
  } catch (err) {
    console.error("Resend email failed", err);
    return Response.json({ error: "邮件发送失败，请稍后重试" }, { status: 502 });
  }

  try {
    await saveToGitHub(data);
  } catch (err) {
    console.error("GitHub persistence failed", err);
    // Emails already sent; don't fail the whole request over storage.
  }

  return Response.json({ ok: true });
}

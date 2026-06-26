"use client";

import { useState } from "react";

const SERVICE_OPTIONS = [
  "选校规划",
  "文书指导",
  "签证咨询（如何解决美加理工类签证问题）",
  "还不确定，想先聊聊",
];

const inputClass =
  "w-full bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded text-[15px] text-[var(--cream)] placeholder:text-[var(--cream-dim)] px-4 py-3 focus:outline-none focus:border-[var(--gold)] transition-colors";

const labelClass = "block text-[13px] text-[var(--gold-soft)] mb-2 leading-relaxed";

export default function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [services, setServices] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  function toggleService(option: string) {
    setServices((prev) =>
      prev.includes(option) ? prev.filter((s) => s !== option) : [...prev, option]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      nickname: (form.elements.namedItem("nickname") as HTMLInputElement).value,
      contact: (form.elements.namedItem("contact") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      gpa: (form.elements.namedItem("gpa") as HTMLInputElement).value,
      target: (form.elements.namedItem("target") as HTMLInputElement).value,
      services,
      about: (form.elements.namedItem("about") as HTMLTextAreaElement).value,
      referral: (form.elements.namedItem("referral") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "提交失败");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "提交失败，请稍后重试");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[var(--gold)]/50 rounded-md p-8 text-center">
        <div className="text-[15px] leading-relaxed">
          收到了，谢谢你认真填写。
          <br />
          我们会在一周之内联系你，确认邮件也已经发到你的邮箱。
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>想让我们怎么称呼你？</label>
        <input name="nickname" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>联系方式（微信号或手机号，方便我们联系你）</label>
        <input name="contact" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>你的邮箱（用来给你发确认信息）</label>
        <input name="email" type="email" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>
          你目前的 GPA 是多少？
          <br />
          <span className="text-[12px] text-[var(--cream-dim)]">
            GPA 不高完全没关系——我们看重的不是分数，而是你是怎样的人、想清楚了要去哪里；比起一份好看的 offer 装饰门面，我们更想帮你找到真正适合、值得你投入的方向。
          </span>
        </label>
        <input name="gpa" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>
          你想申请的国家/地区和学校方向是？
          <br />
          <span className="text-[12px] text-[var(--cream-dim)]">
            可以写具体学校，也可以写大概方向，比如&ldquo;英国G5&rdquo;或&ldquo;加拿大前三&rdquo;
          </span>
        </label>
        <input name="target" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>你希望我们提供哪些服务？（可多选）</label>
        <div className="space-y-2">
          {SERVICE_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-start gap-2 text-[14px] cursor-pointer">
              <input
                type="checkbox"
                checked={services.includes(opt)}
                onChange={() => toggleService(opt)}
                className="mt-1 accent-[var(--gold)]"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          说说你自己——想去哪所学校？为什么？最近在为申请做哪些准备？
          <br />
          <span className="text-[12px] text-[var(--cream-dim)]">
            写多写少都可以，我们想认识真正的你
          </span>
        </label>
        <textarea name="about" rows={4} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>能否告诉我们为什么你想选择我们，是谁推荐给你的吗</label>
        <textarea name="referral" rows={3} className={inputClass} />
      </div>

      {status === "error" && (
        <div className="text-[13px] text-red-300">{errorMsg}</div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-[var(--gold)] text-[var(--navy)] font-medium rounded py-3 text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "submitting" ? "提交中…" : "提交"}
      </button>
    </form>
  );
}

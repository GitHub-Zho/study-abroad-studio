"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function SetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");
    setError("");
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "设置失败");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("网络错误，请稍后重试");
      setStatus("error");
    }
  }

  if (!token) {
    return <p className="text-[14px] text-[var(--cream-dim)]">链接无效，请从注册邮件中的链接进入此页面。</p>;
  }

  if (status === "done") {
    return (
      <div className="border border-[var(--gold)]/50 rounded-md p-6 text-center text-[14px] leading-relaxed">
        密码设置成功，现在可以用邮箱和密码登录了。
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-[13px] text-[var(--gold-soft)] mb-2">设置你的密码</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded text-[15px] px-4 py-3 focus:outline-none focus:border-[var(--gold)]"
        />
      </div>
      {error && <div className="text-[12px] text-red-300">{error}</div>}
      <button
        type="submit"
        disabled={status === "busy"}
        className="w-full bg-[var(--gold)] text-[var(--navy)] font-medium rounded py-3 text-[14px] disabled:opacity-50"
      >
        {status === "busy" ? "提交中…" : "确认设置"}
      </button>
    </form>
  );
}

export default function SetPasswordPage() {
  return (
    <main className="max-w-[420px] mx-auto px-6 py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-[22px] text-center mb-6">
        完成注册
      </h1>
      <Suspense fallback={null}>
        <SetPasswordForm />
      </Suspense>
    </main>
  );
}

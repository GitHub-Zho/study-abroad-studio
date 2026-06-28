"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useSession, signIn } from "next-auth/react";

interface AuthGateValue {
  isLoggedIn: boolean;
  requireLogin: (reason: string) => void;
}

const AuthGateContext = createContext<AuthGateValue | null>(null);

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error("useAuthGate must be used inside AuthGateProvider");
  return ctx;
}

type Mode = "login" | "signup";
type SignupStep = "email" | "code" | "sent";

const inputClass =
  "w-full bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded text-[14px] px-3 py-2.5 focus:outline-none focus:border-[var(--gold)]";

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;
  const [reason, setReason] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [signupStep, setSignupStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function requireLogin(why: string) {
    setReason(why);
    setError("");
  }

  function close() {
    setReason(null);
    setMode("login");
    setSignupStep("email");
    setEmail("");
    setCode("");
    setPassword("");
    setError("");
  }

  function switchMode(next: Mode) {
    setMode(next);
    setSignupStep("email");
    setError("");
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("邮箱或密码不正确");
        return;
      }
      close();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "发送失败");
        return;
      }
      setSignupStep("code");
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "验证失败");
        return;
      }
      setSignupStep("sent");
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthGateContext.Provider value={{ isLoggedIn, requireLogin }}>
      {children}
      {reason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="relative w-full max-w-[380px] bg-[var(--navy)] border border-[var(--gold)]/60 rounded-md p-6">
            <button
              onClick={close}
              className="absolute top-4 right-5 text-[var(--cream-dim)] text-[18px]"
              aria-label="关闭"
            >
              ×
            </button>
            <div className="text-[13px] text-[var(--gold-soft)] mb-4">{reason}</div>
            <div className="flex gap-4 mb-4 text-[13px]">
              <button
                onClick={() => switchMode("login")}
                className={mode === "login" ? "text-[var(--gold)]" : "text-[var(--cream-dim)]"}
              >
                登录
              </button>
              <button
                onClick={() => switchMode("signup")}
                className={mode === "signup" ? "text-[var(--gold)]" : "text-[var(--cream-dim)]"}
              >
                注册
              </button>
            </div>

            {mode === "login" && (
              <form onSubmit={submitLogin} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="password"
                  required
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
                {error && <div className="text-[12px] text-red-300">{error}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-[var(--gold)] text-[var(--navy)] font-medium rounded py-2.5 text-[14px] disabled:opacity-50"
                >
                  {busy ? "处理中…" : "登录"}
                </button>
              </form>
            )}

            {mode === "signup" && signupStep === "email" && (
              <form onSubmit={requestCode} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
                {error && <div className="text-[12px] text-red-300">{error}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-[var(--gold)] text-[var(--navy)] font-medium rounded py-2.5 text-[14px] disabled:opacity-50"
                >
                  {busy ? "发送中…" : "发送验证码"}
                </button>
              </form>
            )}

            {mode === "signup" && signupStep === "code" && (
              <form onSubmit={verifyCode} className="space-y-3">
                <p className="text-[12px] text-[var(--cream-dim)]">
                  验证码已发送到 {email}，10分钟内有效
                </p>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="6位验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass}
                />
                {error && <div className="text-[12px] text-red-300">{error}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-[var(--gold)] text-[var(--navy)] font-medium rounded py-2.5 text-[14px] disabled:opacity-50"
                >
                  {busy ? "验证中…" : "验证"}
                </button>
              </form>
            )}

            {mode === "signup" && signupStep === "sent" && (
              <div className="text-[13px] leading-relaxed">
                验证成功。我们已经给 {email} 发了一封邮件，点击邮件里的链接设置密码，完成注册。
              </div>
            )}
          </div>
        </div>
      )}
    </AuthGateContext.Provider>
  );
}

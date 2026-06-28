"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function requireLogin(why: string) {
    setReason(why);
    setError("");
  }

  function close() {
    setReason(null);
    setEmail("");
    setPassword("");
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "操作失败");
        return;
      }
      setIsLoggedIn(true);
      close();
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
                onClick={() => setMode("login")}
                className={mode === "login" ? "text-[var(--gold)]" : "text-[var(--cream-dim)]"}
              >
                登录
              </button>
              <button
                onClick={() => setMode("signup")}
                className={mode === "signup" ? "text-[var(--gold)]" : "text-[var(--cream-dim)]"}
              >
                注册
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded text-[14px] px-3 py-2.5 focus:outline-none focus:border-[var(--gold)]"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded text-[14px] px-3 py-2.5 focus:outline-none focus:border-[var(--gold)]"
              />
              {error && <div className="text-[12px] text-red-300">{error}</div>}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[var(--gold)] text-[var(--navy)] font-medium rounded py-2.5 text-[14px] disabled:opacity-50"
              >
                {busy ? "处理中…" : mode === "login" ? "登录" : "注册"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AuthGateContext.Provider>
  );
}

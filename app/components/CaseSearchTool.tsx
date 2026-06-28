"use client";

import { useMemo, useState } from "react";
import { cases, allTags } from "../data/cases";
import { useAuthGate } from "./AuthGateContext";

export default function CaseSearchTool() {
  const { isLoggedIn, requireLogin } = useAuthGate();
  const [open, setOpen] = useState(false);
  const [minGpa, setMinGpa] = useState(0);
  const [maxGpa, setMaxGpa] = useState(4);
  const [tag, setTag] = useState<string>("");

  const filtered = useMemo(
    () =>
      cases.filter(
        (c) => c.gpa >= minGpa && c.gpa <= maxGpa && (tag === "" || c.tags.includes(tag))
      ),
    [minGpa, maxGpa, tag]
  );

  function openTool() {
    if (!isLoggedIn) {
      requireLogin("查看完整案例库需要先登录");
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <div className="border border-[var(--gold)]/50 rounded-md p-5">
        <p className="text-[13px] text-[var(--cream-dim)] mb-4">
          输入你的 GPA 和背景标签，看看相近条件的学员申到了什么结果。以下是模糊处理的样例：
        </p>
        <div className="space-y-2 mb-4 opacity-60">
          {cases.slice(0, 2).map((c) => (
            <div key={c.id} className="flex justify-between text-[13px] border-b border-[var(--gold)]/20 pb-2">
              <span className="blur-[3px] select-none">{c.background}</span>
              <span>GPA {c.gpa}</span>
              <span className="blur-[3px] select-none">{c.outcome}</span>
            </div>
          ))}
        </div>
        <button
          onClick={openTool}
          className="w-full bg-[var(--gold)] text-[var(--navy)] font-medium rounded py-2.5 text-[14px]"
        >
          登录查看完整案例库 →
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-[520px] max-h-[85vh] overflow-y-auto bg-[var(--navy)] border border-[var(--gold)]/60 rounded-md p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-5 text-[var(--cream-dim)] text-[18px]"
              aria-label="关闭"
            >
              ×
            </button>
            <h3 className="font-[family-name:var(--font-serif)] text-[18px] mb-4">案例查询</h3>

            <div className="flex flex-wrap gap-3 mb-5 text-[13px]">
              <label className="flex items-center gap-2">
                GPA
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  max={4}
                  value={minGpa}
                  onChange={(e) => setMinGpa(Number(e.target.value))}
                  className="w-16 bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded px-2 py-1"
                />
                –
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  max={4}
                  value={maxGpa}
                  onChange={(e) => setMaxGpa(Number(e.target.value))}
                  className="w-16 bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded px-2 py-1"
                />
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="bg-[var(--navy-light)] border border-[var(--gold)]/40 rounded px-2 py-1 text-[13px]"
              >
                <option value="">全部背景标签</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {filtered.length === 0 && (
                <p className="text-[13px] text-[var(--cream-dim)]">没有匹配的案例，试试放宽筛选条件</p>
              )}
              {filtered.map((c) => (
                <div key={c.id} className="border border-[var(--gold)]/30 rounded p-3 text-[13px] flex justify-between gap-3">
                  <span className="text-[var(--cream-dim)]">{c.background}</span>
                  <span>GPA {c.gpa}</span>
                  <span className="text-[var(--gold)] text-right">{c.outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

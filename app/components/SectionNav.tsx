"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "why-us", label: "为什么找我们" },
  { id: "mentors", label: "王牌导师" },
  { id: "reviews", label: "学员评价" },
  { id: "cases", label: "案例查询" },
  { id: "apply", label: "申请" },
];

export default function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="sticky top-0 z-30 min-w-0 bg-[var(--navy)]/95 backdrop-blur-sm border-b border-[var(--gold)]/20">
      <div className="w-full max-w-[560px] mx-auto px-6 flex gap-5 overflow-x-auto min-w-0 text-[12px] py-3 no-scrollbar">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className={`relative whitespace-nowrap pb-1 transition-colors ${
              active === s.id ? "text-[var(--gold)]" : "text-[var(--cream-dim)]"
            }`}
          >
            {s.label}
            <span
              className={`absolute left-0 right-0 -bottom-[1px] h-[1.5px] bg-[var(--gold)] transition-opacity ${
                active === s.id ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

"use client";

import { useState } from "react";
import { mentors } from "../data/mentors";

export default function MentorTabs() {
  const [activeId, setActiveId] = useState(mentors[0].id);
  const active = mentors.find((m) => m.id === activeId) ?? mentors[0];

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {mentors.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveId(m.id)}
            className={`flex-1 text-center rounded-md border py-3 px-2 transition-colors ${
              m.id === activeId
                ? "border-[var(--gold)] bg-[var(--gold)]/10"
                : "border-[var(--gold)]/30"
            }`}
          >
            <div
              className={`w-9 h-9 mx-auto mb-1.5 rounded-full flex items-center justify-center text-[13px] font-medium ${
                m.id === activeId
                  ? "bg-[var(--gold)] text-[var(--navy)]"
                  : "bg-[var(--navy-light)] text-[var(--gold-soft)]"
              }`}
            >
              {m.name[0]}
            </div>
            <div className="text-[12px]">{m.name}</div>
          </button>
        ))}
      </div>

      <div key={active.id} className="border border-[var(--gold)]/50 rounded-md p-5 animate-[fadeIn_0.25s_ease]">
        <div className="text-[15px] font-medium mb-0.5">
          {active.name} · {active.school}
        </div>
        <div className="text-[12px] text-[var(--cream-dim)] mb-1">{active.undergrad}</div>
        <div className="text-[12px] text-[var(--gold-soft)] mb-3">{active.focus}</div>
        <p className="text-[14px] leading-relaxed text-[#e3d8b8]">{active.bio}</p>
      </div>
    </div>
  );
}

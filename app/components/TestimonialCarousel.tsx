"use client";

import { useRef } from "react";
import { testimonials } from "../data/testimonials";
import { useAuthGate } from "./AuthGateContext";

export default function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, requireLogin } = useAuthGate();

  function scrollBy(delta: number) {
    trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  function handlePostReview() {
    if (!isLoggedIn) {
      requireLogin("发布评价需要先登录");
      return;
    }
    // TODO: open the actual "write a review" form once auth is wired.
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory"
      >
        {testimonials.map((t, i) => (
          <div
            key={t.id}
            className="snap-start flex-shrink-0 w-[78%] border border-[var(--gold)]/50 rounded-md p-4 bg-[var(--navy-light)]/40"
            style={{ transform: i % 2 === 0 ? "rotate(-0.4deg)" : "rotate(0.4deg)" }}
          >
            <p className="text-[13px] leading-relaxed text-[#e3d8b8] mb-3">{t.quote}</p>
            <div className="text-[12px] text-[var(--gold)]">{t.result}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-280)}
            aria-label="上一条"
            className="w-7 h-7 rounded-full border border-[var(--gold)]/50 text-[var(--gold)] text-[13px]"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy(280)}
            aria-label="下一条"
            className="w-7 h-7 rounded-full border border-[var(--gold)]/50 text-[var(--gold)] text-[13px]"
          >
            ›
          </button>
        </div>
        <button onClick={handlePostReview} className="text-[12px] text-[var(--gold-soft)] underline underline-offset-2">
          发布你的评价
        </button>
      </div>
    </div>
  );
}

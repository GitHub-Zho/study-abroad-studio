import ApplicationForm from "./components/ApplicationForm";
import SectionNav from "./components/SectionNav";
import MentorTabs from "./components/MentorTabs";
import TestimonialCarousel from "./components/TestimonialCarousel";
import CaseSearchTool from "./components/CaseSearchTool";
import { AuthGateProvider } from "./components/AuthGateContext";

const CHECK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth={2.5} className="flex-shrink-0 mt-[3px]">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] tracking-[2px] text-[var(--gold)] uppercase mb-2">
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <AuthGateProvider>
      <SectionNav />
      <main className="w-full max-w-[560px] min-w-0 mx-auto px-6 py-10">
        <div className="text-center text-[12px] tracking-[3px] text-[var(--gold)] uppercase mb-4">
          出国留学 · 精品申请工作室
        </div>
        <div className="h-px bg-[var(--gold)]/50 mb-6" />

        <h1 className="text-center font-[family-name:var(--font-serif)] text-[30px] leading-tight mb-3">
          超级无敌厉害
          <br />
          留学咨询工作室
        </h1>
        <p className="text-center text-[15px] text-[var(--gold-soft)] font-[family-name:var(--font-serif)] italic mb-6">
          我们不流水线作业，我们做的是口碑和人脉
        </p>
        <div className="h-px bg-[var(--gold)]/50 mb-7" />

        <SectionLabel>主理团队背景</SectionLabel>
        <p className="text-[14px] text-[#e3d8b8] leading-relaxed mb-10">
          本科人大·清华·北理工·北航出身，现于剑桥·CMU·帝国理工·杜克·多伦多读硕/博
        </p>

        <section id="why-us" className="mb-10">
          <SectionLabel>为什么找我们</SectionLabel>
          <div className="border border-[var(--gold)]/50 rounded-md p-5 space-y-3">
            <div className="flex gap-2 text-[14px] leading-relaxed">
              {CHECK}
              <span>2023年成立至今，仅精选服务30组家庭——少而精，不追求数量</span>
            </div>
            <div className="flex gap-2 text-[14px] leading-relaxed">
              {CHECK}
              <span>每个家庭的签证方案都按背景定制——理工科背景申请美加的细节，我们尤其熟悉</span>
            </div>
            <div className="flex gap-2 text-[14px] leading-relaxed">
              {CHECK}
              <span>系统化工具全程跟踪申请进度、整理材料、提醒每个deadline，不让任何环节掉链子</span>
            </div>
          </div>
        </section>

        <section id="mentors" className="mb-10">
          <SectionLabel>王牌导师</SectionLabel>
          <MentorTabs />
        </section>

        <section id="reviews" className="mb-10">
          <SectionLabel>学员评价</SectionLabel>
          <TestimonialCarousel />
        </section>

        <section id="cases" className="mb-10">
          <SectionLabel>背景案例查询</SectionLabel>
          <CaseSearchTool />
        </section>

        <SectionLabel>学生录取去向</SectionLabel>
        <p className="text-[14px] text-[#e3d8b8] leading-relaxed mb-10">
          剑桥 · 卡内基梅隆 · 帝国理工 · 香港大学 · 澳洲名校 · 新加坡国立大学
        </p>

        <div className="text-center mb-7">
          <SectionLabel>主攻方向</SectionLabel>
          <div className="font-[family-name:var(--font-serif)] text-[24px] mb-1">硕士申请</div>
          <div className="text-[14px] text-[var(--gold-soft)] tracking-wide">
            美国 · 加拿大 · 英国 · 澳洲 · 香港
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { label: "选校规划", d: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z M9 3v15 M15 6v15" },
            { label: "文书指导", d: "M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" },
            { label: "签证咨询", d: "M3 4h18v16H3z M3 9h18 M8 4v5" },
          ].map((s) => (
            <div key={s.label} className="border border-[var(--gold)]/50 rounded-md py-4 px-1 text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth={1.8} className="mx-auto mb-2">
                <path d={s.d} />
              </svg>
              <div className="text-[12px]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="h-px bg-[var(--gold)]/50 mb-7" />

        <section id="apply">
          <div className="text-center mb-2">
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] mb-1">填写申请意向表</h2>
            <p className="text-[13px] text-[var(--cream-dim)]">
              花几分钟告诉我们你的情况，我们会在一周之内联系你
            </p>
          </div>

          <div className="mt-6">
            <ApplicationForm />
          </div>
        </section>

        <footer className="text-center text-[12px] text-[var(--cream-dim)] mt-10">
          超级无敌工作室
        </footer>
      </main>
    </AuthGateProvider>
  );
}

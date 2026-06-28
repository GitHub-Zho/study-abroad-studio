export interface CaseRecord {
  id: string;
  gpa: number; // out of 4.0
  background: string;
  tags: string[];
  target: string;
  outcome: string;
  year: number;
}

// Sample/placeholder dataset for design review. Real version intended to be
// backed by a larger curated dataset (see project notes on sourcing).
export const cases: CaseRecord[] = [
  { id: "c1", gpa: 3.9, background: "清华 · 计算机", tags: ["理工科", "CS"], target: "美国", outcome: "卡内基梅隆大学 MSCS", year: 2025 },
  { id: "c2", gpa: 3.2, background: "双非 · 金融", tags: ["商科", "双非"], target: "英国", outcome: "帝国理工学院 金融硕士", year: 2025 },
  { id: "c3", gpa: 3.6, background: "北航 · 自动化", tags: ["理工科", "签证敏感专业"], target: "美国", outcome: "卡内基梅隆大学 机器人方向", year: 2024 },
  { id: "c4", gpa: 2.9, background: "人大 · 社会学", tags: ["文科", "低GPA"], target: "香港", outcome: "香港大学 社会科学硕士", year: 2025 },
  { id: "c5", gpa: 3.4, background: "北理工 · 电子工程", tags: ["理工科"], target: "加拿大", outcome: "多伦多大学 电子工程硕士", year: 2024 },
  { id: "c6", gpa: 3.1, background: "二本 · 工商管理", tags: ["商科", "双非"], target: "新加坡", outcome: "新加坡国立大学 管理学硕士", year: 2025 },
  { id: "c7", gpa: 3.8, background: "清华 · 建筑学", tags: ["转专业"], target: "英国", outcome: "剑桥大学 城市设计硕士", year: 2024 },
  { id: "c8", gpa: 3.3, background: "三本 · 英语", tags: ["文科", "双非", "转专业"], target: "澳洲", outcome: "墨尔本大学 教育学硕士", year: 2025 },
  { id: "c9", gpa: 3.7, background: "人大 · 法学", tags: ["文科"], target: "香港", outcome: "香港大学 法律硕士", year: 2024 },
  { id: "c10", gpa: 3.0, background: "双非 · 计算机", tags: ["理工科", "低GPA", "双非"], target: "美国", outcome: "南加州大学 CS硕士", year: 2025 },
];

export const allTags = Array.from(new Set(cases.flatMap((c) => c.tags)));

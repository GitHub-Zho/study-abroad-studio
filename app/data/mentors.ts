export interface Mentor {
  id: string;
  name: string;
  school: string;
  undergrad: string;
  focus: string;
  bio: string;
}

export const mentors: Mentor[] = [
  {
    id: "yiran",
    name: "Yiran",
    school: "剑桥大学在读硕士",
    undergrad: "本科 中国人民大学",
    focus: "英国 / 香港 · 文科社科方向",
    bio: "本科在人大读社会学，申请季自己也踩过不少坑，所以现在带学生最看重\"选校逻辑要讲得通\"——不是排名越高越好，是适配越高越好。文书是她最花心思的部分，经常一篇改到第七八版。",
  },
  {
    id: "kevin",
    name: "Kevin",
    school: "CMU在读硕士",
    undergrad: "本科 北京理工大学",
    focus: "北美理工科 · 签证专项",
    bio: "理工科背景，本科北理工，申请美国时亲身经历过签证加审，所以对这类背景的材料准备和面签细节格外熟悉。带的学生大多是计算机、工程方向，喜欢把申请拆解成清单一步步过。",
  },
  {
    id: "stella",
    name: "Stella",
    school: "帝国理工在读硕士",
    undergrad: "本科 清华大学",
    focus: "英国 / 新加坡 · 转专业方向",
    bio: "本科清华，研究生转了方向去帝国理工，自己就是\"转专业申请\"的活案例，所以特别擅长帮那些想换方向、又担心背景不匹配的学生把故事线理顺，找到能讲通的申请逻辑。",
  },
];

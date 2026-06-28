export interface Testimonial {
  id: string;
  quote: string;
  result: string;
}

// NOTE: placeholder/draft copy for design review — must be swapped for real
// student feedback (with permission) before this goes live.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "真的会被自己的导师追着问\"你今天文书写了吗\"，一开始觉得有点烦，后来发现没这个盯着我估计现在还在deadline前摆烂。最后录了CMU，谢谢老师不嫌弃我拖延症晚期。",
    result: "录取 卡内基梅隆大学",
  },
  {
    id: "t2",
    quote:
      "我是那种GPA刚过3.0、简历写出来自己都不想看的类型。本来做好心理准备被劝退，结果对面说\"没事，我们看的不是这个\"，整个人当场松了一大口气。最后拿到了港大offer，现在逢人就吹。",
    result: "录取 香港大学",
  },
  {
    id: "t3",
    quote:
      "哎呀，这位老师果真是非常厉害，不愧是剑桥学长。他不只负责文书规划和选校，还帮我想清了未来的发展方向。总之对我帮助很大，非常推荐！",
    result: "录取 剑桥大学",
  },
  {
    id: "t4",
    quote:
      "北航本科+想去美国，本来天天emo签证会不会被卡，没想到团队里真的有人是这个背景出身，聊的时候直接报出来哪些材料容易被多问，安全感拉满。",
    result: "录取 卡内基梅隆大学",
  },
  {
    id: "t5",
    quote:
      "选校规划那次视频会开了快两个小时，我妈在旁边听着都说\"这比我当年找工作还认真\"，最后三个国家八所学校，一个不落地全安排明白。",
    result: "录取 帝国理工学院",
  },
  {
    id: "t6",
    quote: "不夸张地说，文书被改到我自己都快不认识了，但确实是改好了，最后进了帝国理工，值。",
    result: "录取 帝国理工学院",
  },
  {
    id: "t7",
    quote:
      "一开始以为这种工作室都是套模板话术，结果发现选校建议是真按我背景给的，不是无差别推荐，这点挺意外的。",
    result: "录取 香港大学",
  },
  {
    id: "t8",
    quote:
      "申请季崩溃边缘疯狂@老师，对面秒回的速度让我一度怀疑是不是不用睡觉，最后录的新加坡国立，谢谢没把我的emo当成洪水猛兽。",
    result: "录取 新加坡国立大学",
  },
];

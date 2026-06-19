import type { GameEvent } from '@/types';

export const gameEvents: GameEvent[] = [
  {
    id: 'e1',
    title: '设备故障',
    description: '冷藏柜突然故障，部分商品需要紧急处理，维修费用不菲。',
    type: 'negative',
    effect: { moneyChange: -800, reputationChange: -2 },
  },
  {
    id: 'e2',
    title: '商品过期',
    description: '一批面包和牛奶过期了，只能销毁处理，损失了一笔钱。',
    type: 'negative',
    effect: { moneyChange: -500, reputationChange: -1 },
  },
  {
    id: 'e3',
    title: '员工离职',
    description: '一名资深员工突然辞职，招聘新员工需要时间和培训成本。',
    type: 'negative',
    effect: { moneyChange: -600, reputationChange: -3 },
  },
  {
    id: 'e4',
    title: '周边新建写字楼',
    description: '附近新建了一栋写字楼，上班族客流大幅增加！',
    type: 'positive',
    effect: { customerMultiplier: 1.4, reputationChange: 5 },
  },
  {
    id: 'e5',
    title: '网红打卡',
    description: '一位网红在你的便利店拍摄视频，意外走红，客流暴增！',
    type: 'positive',
    effect: { customerMultiplier: 1.6, reputationChange: 8 },
  },
  {
    id: 'e6',
    title: '天气突变',
    description: '突然下起暴雨，雨伞销量大增，但其他商品销量略有下降。',
    type: 'neutral',
    effect: { moneyChange: 300 },
  },
  {
    id: 'e7',
    title: '竞争对手开业',
    description: '对面新开了一家连锁便利店，分流了一部分客流。',
    type: 'neutral',
    effect: { customerMultiplier: 0.85, reputationChange: -2 },
  },
  {
    id: 'e8',
    title: '政府补贴',
    description: '政府推出小微企业扶持政策，你获得了一笔经营补贴。',
    type: 'policy',
    effect: { moneyChange: 2000 },
  },
  {
    id: 'e9',
    title: '税收调整',
    description: '税收优惠政策到期，每月税费有所增加。',
    type: 'policy',
    effect: { moneyChange: -300 },
  },
  {
    id: 'e10',
    title: '社区活动',
    description: '社区举办大型活动，你的便利店被选为指定补给点。',
    type: 'positive',
    effect: { customerMultiplier: 1.3, reputationChange: 3 },
  },
  {
    id: 'e11',
    title: '供货商涨价',
    description: '主要供货商上调了批发价格，进货成本增加。',
    type: 'negative',
    effect: { moneyChange: -400 },
  },
  {
    id: 'e12',
    title: '停电事故',
    description: '区域停电半天，影响了正常营业，部分商品受损。',
    type: 'negative',
    effect: { moneyChange: -700, reputationChange: -2 },
  },
  {
    id: 'e13',
    title: '学校开学',
    description: '附近学校开学，学生客流明显增多，零食饮料销量大涨。',
    type: 'positive',
    effect: { customerMultiplier: 1.25, reputationChange: 2 },
  },
  {
    id: 'e14',
    title: '节日促销季',
    description: '临近节日，消费氛围浓厚，顾客购买意愿增强。',
    type: 'positive',
    effect: { customerMultiplier: 1.2, reputationChange: 1 },
  },
  {
    id: 'e15',
    title: '疫情管控',
    description: '突发公共卫生事件管控，客流受到限制。',
    type: 'negative',
    effect: { customerMultiplier: 0.7, reputationChange: -5 },
  },
];

export function getRandomEvent(): GameEvent {
  const randomIndex = Math.floor(Math.random() * gameEvents.length);
  return gameEvents[randomIndex];
}

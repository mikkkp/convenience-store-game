export interface StaffMember {
  id: string;
  name: string;
  salary: number;
  skill: number;
  satisfaction: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  demand: number;
  baseDemand: number;
  weatherBonus?: number[];
}

export interface Marketing {
  promotionActive: boolean;
  promotionDiscount: number;
  rebateRate: number;
  adSpend: number;
}

export interface Store {
  rent: number;
  utilities: number;
  size: number;
  reputation: number;
}

export type WeatherType = 'sunny' | 'rainy' | 'cloudy' | 'hot' | 'cold' | 'snowy';

export interface Weather {
  type: WeatherType;
  name: string;
  description: string;
  customerMultiplier: number;
  productEffects: Record<string, number>;
}

export interface RevenueBreakdown {
  productRevenue: number;
  categoryRevenue: Record<string, number>;
}

export interface ExpenseBreakdown {
  productCost: number;
  staffCost: number;
  rent: number;
  utilities: number;
  adSpend: number;
  promotionCost: number;
  rebateCost: number;
}

export interface CostVolumeProfit {
  revenue: number;
  variableCost: number;
  contributionMargin: number;
  fixedCost: number;
  profit: number;
  contributionMarginRatio: number;
  breakEvenPoint: number;
}

export interface MonthRecord {
  month: number;
  revenue: number;
  expenses: number;
  profit: number;
  customerCount: number;
  satisfaction: number;
  weather: WeatherType;
  revenueBreakdown: RevenueBreakdown;
  expenseBreakdown: ExpenseBreakdown;
  cvlAnalysis: CostVolumeProfit;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'policy';
  effect: EventEffect;
}

export interface EventEffect {
  moneyChange?: number;
  reputationChange?: number;
  customerMultiplier?: number;
  rentChange?: number;
  utilitiesChange?: number;
}

export interface MonthResult {
  revenue: number;
  expenses: number;
  profit: number;
  newMoney: number;
  customerCount: number;
  satisfaction: number;
  isGameOver: boolean;
  isVictory: boolean;
  revenueBreakdown: RevenueBreakdown;
  expenseBreakdown: ExpenseBreakdown;
  cvlAnalysis: CostVolumeProfit;
}

export interface ForecastDetail {
  customerCount: number;
  baseCustomers: number;
  priceEffect: number;
  promotionEffect: number;
  rebateEffect: number;
  adEffect: number;
  staffEffect: number;
  reputationEffect: number;
  weatherEffect: number;
  adCustomerBoost: number;
  rebateCustomerBoost: number;
  promotionCustomerBoost: number;
  adRoiEstimate: number;
  rebateRoiEstimate: number;
  promotionRoiEstimate: number;
  adEfficiencyLevel: 'low' | 'medium' | 'high';
  rebateEfficiencyLevel: 'low' | 'medium' | 'high';
  nextWeather: Weather;
  weatherHint: string;
}

export type GameMode = 'target' | 'endless';

export interface GameState {
  currentMonth: number;
  totalMonths: number;
  money: number;
  targetMoney: number;
  store: Store;
  staff: StaffMember[];
  products: Product[];
  marketing: Marketing;
  history: MonthRecord[];
  isGameOver: boolean;
  isVictory: boolean;
  currentEvent: GameEvent | null;
  eventHistory: GameEvent[];
  currentWeather: Weather;
  gameMode: GameMode;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  months: number;
  finalMoney: number;
  date: string;
  gameMode: GameMode;
}

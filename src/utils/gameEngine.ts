import type { GameState, MonthResult, GameEvent, RevenueBreakdown, ExpenseBreakdown, ForecastDetail, CostVolumeProfit } from '@/types';
import { getRandomEvent } from '@/data/events';
import { generateWeather } from '@/data/weather';

// Marketing efficiency fluctuates based on month and random factors
function getAdEfficiency(month: number): number {
  // Seasonal fluctuation: peak in summer (months 6-8) and year-end (months 11-12)
  const seasonalFactor = 1 + 0.3 * Math.sin((month - 1) * Math.PI / 6);
  // Random fluctuation: ±20%
  const randomFactor = 0.8 + Math.random() * 0.4;
  // Diminishing returns: efficiency drops as month increases (market saturation)
  const saturationFactor = Math.max(0.6, 1 - (month - 1) * 0.01);
  return seasonalFactor * randomFactor * saturationFactor;
}

function getRebateEfficiency(month: number): number {
  // Rebate works better in stable periods, worse during events
  const stabilityFactor = 0.9 + Math.random() * 0.2;
  // Customer loyalty builds over time
  const loyaltyFactor = Math.min(1.3, 1 + (month - 1) * 0.02);
  return stabilityFactor * loyaltyFactor;
}

function getPromotionEfficiency(month: number): number {
  // Promotion effectiveness varies significantly
  const baseEfficiency = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
  // Too frequent promotions reduce effectiveness
  const fatigueFactor = Math.max(0.5, 1 - (month % 3) * 0.1);
  return baseEfficiency * fatigueFactor;
}

export function calculateCustomerCount(state: GameState): number {
  const baseCustomers = state.store.size * 15;
  
  // Enhanced price sensitivity: each product's price affects overall store attractiveness
  // Higher prices = fewer customers, with exponential penalty for extreme pricing
  const priceSensitivity = state.products.reduce((sum, p) => {
    const priceRatio = p.salePrice / p.costPrice;
    // Base penalty: 1.0 at 1.5x cost, drops to 0.3 at 3x cost, 0.1 at 5x cost
    let penalty = 1.0;
    if (priceRatio > 3.0) {
      // Severe penalty for extreme pricing (>3x cost)
      penalty = Math.max(0.1, 1.0 - (priceRatio - 1.5) * 0.6);
    } else if (priceRatio > 2.0) {
      // Moderate penalty for high pricing (2x-3x cost)
      penalty = Math.max(0.5, 1.0 - (priceRatio - 1.5) * 0.4);
    } else if (priceRatio > 1.5) {
      // Mild penalty for normal high pricing (1.5x-2x cost)
      penalty = Math.max(0.7, 1.0 - (priceRatio - 1.5) * 0.2);
    } else {
      // Slight bonus for competitive pricing
      penalty = Math.min(1.1, 1.0 + (1.5 - priceRatio) * 0.1);
    }
    return sum + penalty;
  }, 0) / state.products.length;
  
  const avgPriceRatio = state.products.reduce((sum, p) => sum + p.salePrice / p.costPrice, 0) / state.products.length;
  
  // Overall price effect: combines average markup with individual product penalties
  const basePriceEffect = Math.max(0.3, Math.min(1.2, 1.3 - (avgPriceRatio - 1.5) * 0.3));
  const priceEffect = basePriceEffect * priceSensitivity;
  
  // Dynamic promotion effect with diminishing returns and fatigue
  const promotionEfficiency = getPromotionEfficiency(state.currentMonth);
  const promotionEffect = state.marketing.promotionActive ? (1 + 0.3 * promotionEfficiency) : 1.0;
  
  // Dynamic rebate effect with loyalty building
  const rebateEfficiency = getRebateEfficiency(state.currentMonth);
  const rebateEffect = 1 + state.marketing.rebateRate * 0.5 * rebateEfficiency;
  
  // Dynamic ad effect with seasonal fluctuation and saturation
  const adEfficiency = getAdEfficiency(state.currentMonth);
  // Diminishing returns for ad spend: sqrt curve instead of linear
  const adSpendFactor = Math.sqrt(state.marketing.adSpend / 1000);
  const adEffect = 1 + adSpendFactor * 0.15 * adEfficiency;
  
  const staffEffect = 1 + (state.staff.reduce((sum, s) => sum + s.skill, 0) / Math.max(1, state.staff.length)) / 100;
  const reputationEffect = 1 + (state.store.reputation - 50) / 100;
  const weatherEffect = state.currentWeather.customerMultiplier;

  return Math.round(
    baseCustomers * priceEffect * promotionEffect * rebateEffect * adEffect * staffEffect * reputationEffect * weatherEffect
  );
}

export function calculateRevenue(state: GameState, customerCount: number): { revenue: number; breakdown: RevenueBreakdown } {
  let totalRevenue = 0;
  const weather = state.currentWeather;
  const categoryRevenue: Record<string, number> = {};

  for (const product of state.products) {
    const priceRatio = product.salePrice / product.costPrice;
    
    // Enhanced price elasticity: demand drops sharply as price increases
    // At 1.5x cost: 100% demand, at 2x cost: 70% demand, at 3x cost: 35% demand, at 5x cost: 10% demand
    let priceFactor: number;
    if (priceRatio <= 1.0) {
      priceFactor = 1.2; // Slight bonus for at-cost pricing
    } else if (priceRatio <= 1.5) {
      priceFactor = 1.2 - (priceRatio - 1.0) * 0.4; // 1.2 -> 1.0
    } else if (priceRatio <= 2.5) {
      priceFactor = 1.0 - (priceRatio - 1.5) * 0.5; // 1.0 -> 0.5
    } else if (priceRatio <= 4.0) {
      priceFactor = Math.max(0.2, 0.5 - (priceRatio - 2.5) * 0.2); // 0.5 -> 0.2
    } else {
      priceFactor = Math.max(0.05, 0.2 - (priceRatio - 4.0) * 0.05); // 0.2 -> 0.05
    }
    
    const weatherFactor = weather.productEffects[product.category] || 1.0;
    const demandFactor = product.demand * priceFactor * weatherFactor;
    const targetSales = Math.round(customerCount * demandFactor);
    const actualSales = Math.min(targetSales, product.stock);
    const productRevenue = actualSales * product.salePrice;
    totalRevenue += productRevenue;
    categoryRevenue[product.category] = (categoryRevenue[product.category] || 0) + productRevenue;
  }

  return {
    revenue: Math.round(totalRevenue),
    breakdown: {
      productRevenue: Math.round(totalRevenue),
      categoryRevenue,
    },
  };
}

export function calculateProductCost(state: GameState, customerCount: number): { cost: number; breakdown: Record<string, number> } {
  let totalCost = 0;
  const weather = state.currentWeather;
  const categoryCost: Record<string, number> = {};

  for (const product of state.products) {
    const priceRatio = product.salePrice / product.costPrice;
    
    // Use the same price factor as revenue calculation for consistency
    let priceFactor: number;
    if (priceRatio <= 1.0) {
      priceFactor = 1.2;
    } else if (priceRatio <= 1.5) {
      priceFactor = 1.2 - (priceRatio - 1.0) * 0.4;
    } else if (priceRatio <= 2.5) {
      priceFactor = 1.0 - (priceRatio - 1.5) * 0.5;
    } else if (priceRatio <= 4.0) {
      priceFactor = Math.max(0.2, 0.5 - (priceRatio - 2.5) * 0.2);
    } else {
      priceFactor = Math.max(0.05, 0.2 - (priceRatio - 4.0) * 0.05);
    }
    
    const weatherFactor = weather.productEffects[product.category] || 1.0;
    const demandFactor = product.demand * priceFactor * weatherFactor;
    const targetSales = Math.round(customerCount * demandFactor);
    const actualSales = Math.min(targetSales, product.stock);
    const productCost = actualSales * product.costPrice;
    totalCost += productCost;
    categoryCost[product.category] = (categoryCost[product.category] || 0) + productCost;
  }

  return {
    cost: Math.round(totalCost),
    breakdown: categoryCost,
  };
}

export function calculateExpenses(state: GameState): { total: number; breakdown: ExpenseBreakdown } {
  const staffCost = state.staff.reduce((sum, s) => sum + s.salary, 0);
  const rent = state.store.rent;
  const utilities = state.store.utilities;
  const adSpend = state.marketing.adSpend;
  const promotionCost = state.marketing.promotionActive ? 500 : 0;
  // Rebate cost is a percentage of revenue, not tied to ad spend
  const rebateCost = 0; // Will be calculated after revenue is known

  return {
    total: Math.round(staffCost + rent + utilities + adSpend + promotionCost),
    breakdown: {
      productCost: 0,
      staffCost,
      rent,
      utilities,
      adSpend,
      promotionCost,
      rebateCost: 0,
    },
  };
}

export function calculateCVL(
  revenue: number,
  productCost: number,
  expenses: ExpenseBreakdown
): CostVolumeProfit {
  // Variable cost = product cost (changes with sales volume)
  const variableCost = productCost;
  // Contribution margin = revenue - variable cost
  const contributionMargin = revenue - variableCost;
  // Contribution margin ratio
  const contributionMarginRatio = revenue > 0 ? contributionMargin / revenue : 0;
  // Fixed cost = all other costs (doesn't change with sales volume)
  const fixedCost = expenses.staffCost + expenses.rent + expenses.utilities + expenses.adSpend + expenses.promotionCost + expenses.rebateCost;
  // Profit = contribution margin - fixed cost
  const profit = contributionMargin - fixedCost;
  // Break-even point = fixed cost / contribution margin ratio
  const breakEvenPoint = contributionMarginRatio > 0 ? fixedCost / contributionMarginRatio : 0;

  return {
    revenue,
    variableCost,
    contributionMargin,
    fixedCost,
    profit,
    contributionMarginRatio: Math.round(contributionMarginRatio * 100) / 100,
    breakEvenPoint: Math.round(breakEvenPoint),
  };
}

export function applyEventEffects(state: GameState, event: GameEvent | null): number {
  if (!event) return 0;

  let moneyChange = event.effect.moneyChange || 0;

  if (event.effect.customerMultiplier) {
    const customerCount = calculateCustomerCount(state);
    const normalRevenue = calculateRevenue(state, customerCount).revenue;
    const adjustedRevenue = calculateRevenue(state, Math.round(customerCount * event.effect.customerMultiplier)).revenue;
    moneyChange += adjustedRevenue - normalRevenue;
  }

  return moneyChange;
}

export function calculateMonth(state: GameState): MonthResult {
  const customerCount = calculateCustomerCount(state);
  const { revenue, breakdown: revenueBreakdown } = calculateRevenue(state, customerCount);
  const { cost: productCost, breakdown: categoryCost } = calculateProductCost(state, customerCount);
  const { total: baseExpenses, breakdown: expenseBreakdown } = calculateExpenses(state);
  
  // Calculate rebate cost based on actual revenue
  const rebateCost = Math.round(revenue * state.marketing.rebateRate);
  const totalExpenses = baseExpenses + productCost + rebateCost;
  
  // Update expense breakdown with rebate cost
  const updatedExpenseBreakdown: ExpenseBreakdown = {
    ...expenseBreakdown,
    productCost,
    rebateCost,
  };
  
  const eventEffect = applyEventEffects(state, state.currentEvent);
  const profit = revenue - totalExpenses + eventEffect;
  const newMoney = state.money + profit;

  const avgSatisfaction = state.staff.length > 0
    ? state.staff.reduce((sum, s) => sum + s.satisfaction, 0) / state.staff.length
    : 50;
  const satisfaction = Math.round(
    Math.min(100, Math.max(0, avgSatisfaction + (state.store.reputation - 50) * 0.2))
  );

  // Calculate CVL analysis
  const cvlAnalysis = calculateCVL(revenue, productCost, updatedExpenseBreakdown);

  const isGameOver = newMoney < 0;
  const isVictory = state.gameMode === 'target'
    ? (newMoney >= state.targetMoney || state.currentMonth >= state.totalMonths)
    : false;

  return {
    revenue,
    expenses: totalExpenses,
    profit,
    newMoney,
    customerCount,
    satisfaction,
    isGameOver,
    isVictory,
    revenueBreakdown: {
      productRevenue: revenue,
      categoryRevenue: revenueBreakdown.categoryRevenue,
    },
    expenseBreakdown: updatedExpenseBreakdown,
    cvlAnalysis,
  };
}

export function getForecastDetail(state: GameState): ForecastDetail {
  const baseCustomers = state.store.size * 15;
  
  // Enhanced price sensitivity for forecast
  const priceSensitivity = state.products.reduce((sum, p) => {
    const priceRatio = p.salePrice / p.costPrice;
    let penalty = 1.0;
    if (priceRatio > 3.0) {
      penalty = Math.max(0.1, 1.0 - (priceRatio - 1.5) * 0.6);
    } else if (priceRatio > 2.0) {
      penalty = Math.max(0.5, 1.0 - (priceRatio - 1.5) * 0.4);
    } else if (priceRatio > 1.5) {
      penalty = Math.max(0.7, 1.0 - (priceRatio - 1.5) * 0.2);
    } else {
      penalty = Math.min(1.1, 1.0 + (1.5 - priceRatio) * 0.1);
    }
    return sum + penalty;
  }, 0) / state.products.length;
  
  const avgPriceRatio = state.products.reduce((sum, p) => sum + p.salePrice / p.costPrice, 0) / state.products.length;
  const basePriceEffect = Math.max(0.3, Math.min(1.2, 1.3 - (avgPriceRatio - 1.5) * 0.3));
  const priceEffect = basePriceEffect * priceSensitivity;
  
  const adEfficiency = getAdEfficiency(state.currentMonth);
  const rebateEfficiency = getRebateEfficiency(state.currentMonth);
  const promotionEfficiency = getPromotionEfficiency(state.currentMonth);
  
  const promotionEffect = state.marketing.promotionActive ? (1 + 0.3 * promotionEfficiency) : 1.0;
  const rebateEffect = 1 + state.marketing.rebateRate * 0.5 * rebateEfficiency;
  const adSpendFactor = Math.sqrt(state.marketing.adSpend / 1000);
  const adEffect = 1 + adSpendFactor * 0.15 * adEfficiency;
  
  const staffEffect = 1 + (state.staff.reduce((sum, s) => sum + s.skill, 0) / Math.max(1, state.staff.length)) / 100;
  const reputationEffect = 1 + (state.store.reputation - 50) / 100;
  const weatherEffect = state.currentWeather.customerMultiplier;

  const customerCount = Math.round(
    baseCustomers * priceEffect * promotionEffect * rebateEffect * adEffect * staffEffect * reputationEffect * weatherEffect
  );

  const baseCount = Math.round(baseCustomers * priceEffect * staffEffect * reputationEffect * weatherEffect);
  const adCustomerBoost = Math.round(baseCount * (adEffect - 1));
  const rebateCustomerBoost = Math.round(baseCount * (rebateEffect - 1));
  const promotionCustomerBoost = Math.round(baseCount * (promotionEffect - 1));

  // ROI estimates with efficiency levels
  const adRoiEstimate = adEfficiency * 100;
  const rebateRoiEstimate = rebateEfficiency * 100;
  const promotionRoiEstimate = promotionEfficiency * 100;

  const getEfficiencyLevel = (efficiency: number): 'low' | 'medium' | 'high' => {
    if (efficiency < 0.85) return 'low';
    if (efficiency < 1.15) return 'medium';
    return 'high';
  };

  const nextWeather = generateWeather();
  const weatherHint = getWeatherHint(nextWeather.type);

  return {
    customerCount,
    baseCustomers,
    priceEffect,
    promotionEffect,
    rebateEffect,
    adEffect,
    staffEffect,
    reputationEffect,
    weatherEffect,
    adCustomerBoost,
    rebateCustomerBoost,
    promotionCustomerBoost,
    adRoiEstimate,
    rebateRoiEstimate,
    promotionRoiEstimate,
    adEfficiencyLevel: getEfficiencyLevel(adEfficiency),
    rebateEfficiencyLevel: getEfficiencyLevel(rebateEfficiency),
    nextWeather,
    weatherHint,
  };
}

function getWeatherHint(type: string): string {
  const hints: Record<string, string> = {
    sunny: '预计天气晴朗，客流平稳，适合正常经营',
    rainy: '预计有雨，客流可能减少，建议备足雨伞',
    cloudy: '预计多云，天气舒适，客流正常',
    hot: '预计高温，饮料需求将大幅增加',
    cold: '预计降温，热饮和方便食品需求增加',
    snowy: '预计降雪，客流大幅减少，注意保暖商品备货',
  };
  return hints[type] || '天气变化莫测，做好准备';
}

export function generateEvent(): GameEvent | null {
  if (Math.random() < 0.6) {
    return getRandomEvent();
  }
  return null;
}

export function restockProducts(state: GameState): GameState {
  const updatedProducts = state.products.map(p => ({
    ...p,
    stock: p.stock + Math.round(p.baseDemand * 500),
  }));
  return { ...state, products: updatedProducts };
}

export function updateStaffSatisfaction(state: GameState): GameState {
  const updatedStaff = state.staff.map(s => {
    const marketAvgSalary = 3500;
    const salaryDiff = (s.salary - marketAvgSalary) / marketAvgSalary;
    const satisfactionChange = salaryDiff * 20;
    return {
      ...s,
      satisfaction: Math.round(Math.min(100, Math.max(0, s.satisfaction + satisfactionChange))),
    };
  });
  return { ...state, staff: updatedStaff };
}

export function checkStaffDeparture(state: GameState): { updatedState: GameState; departures: string[] } {
  const departures: string[] = [];
  const updatedStaff = state.staff.filter(s => {
    if (s.satisfaction < 30 && Math.random() < 0.5) {
      departures.push(s.name);
      return false;
    }
    return true;
  });

  return {
    updatedState: { ...state, staff: updatedStaff },
    departures,
  };
}

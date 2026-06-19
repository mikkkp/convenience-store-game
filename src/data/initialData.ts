import type { GameState } from '@/types';
import { initialProducts } from './products';
import { generateWeather } from './weather';

export function createInitialState(gameMode: 'target' | 'endless' = 'target'): GameState {
  return {
    currentMonth: 1,
    totalMonths: gameMode === 'target' ? 36 : 9999,
    money: 50000,
    targetMoney: gameMode === 'target' ? 100000 : 999999999,
    store: {
      rent: 3000,
      utilities: 800,
      size: 50,
      reputation: 50,
    },
    staff: [
      {
        id: 's1',
        name: '小王',
        salary: 3500,
        skill: 60,
        satisfaction: 70,
      },
    ],
    products: initialProducts.map(p => ({ ...p })),
    marketing: {
      promotionActive: false,
      promotionDiscount: 0,
      rebateRate: 0,
      adSpend: 0,
    },
    history: [],
    isGameOver: false,
    isVictory: false,
    currentEvent: null,
    eventHistory: [],
    currentWeather: generateWeather(),
    gameMode,
  };
}

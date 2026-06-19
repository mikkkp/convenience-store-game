import { create } from 'zustand';
import type { GameState, MonthRecord, LeaderboardEntry, GameMode } from '@/types';
import { createInitialState } from '@/data/initialData';
import { generateWeather } from '@/data/weather';
import {
  calculateMonth,
  generateEvent,
  restockProducts,
  updateStaffSatisfaction,
  checkStaffDeparture,
  getForecastDetail,
} from '@/utils/gameEngine';

const SAVE_KEY = 'convenience-store-save';
const LEADERBOARD_KEY = 'convenience-store-leaderboard';

interface GameStore extends GameState {
  // Actions
  startNewGame: (mode?: GameMode) => void;
  loadGame: () => boolean;
  saveGame: () => void;
  nextMonth: () => void;
  updateProductPrice: (productId: string, price: number) => void;
  updateProductStock: (productId: string, stock: number) => void;
  hireStaff: (name: string, salary: number) => void;
  fireStaff: (staffId: string) => void;
  updateStaffSalary: (staffId: string, salary: number) => void;
  updateMarketing: (updates: Partial<GameState['marketing']>) => void;
  negotiateRent: () => void;
  dismissEvent: () => void;
  // Leaderboard
  getLeaderboard: () => LeaderboardEntry[];
  addToLeaderboard: (name: string) => void;
  // Computed
  getMonthlyForecast: () => { revenue: number; expenses: number; profit: number; customerCount: number };
  getForecastDetail: () => import('@/types').ForecastDetail;
}

function loadFromStorage(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  startNewGame: (mode: GameMode = 'target') => {
    const newState = createInitialState(mode);
    set(newState);
    saveToStorage(newState);
  },

  loadGame: () => {
    const saved = loadFromStorage();
    if (saved) {
      set(saved);
      return true;
    }
    return false;
  },

  saveGame: () => {
    saveToStorage(get());
  },

  nextMonth: () => {
    const state = get();
    if (state.isGameOver || state.isVictory) return;

    // Calculate month result
    const result = calculateMonth(state);

    // Create month record
    const record: MonthRecord = {
      month: state.currentMonth,
      revenue: result.revenue,
      expenses: result.expenses,
      profit: result.profit,
      customerCount: result.customerCount,
      satisfaction: result.satisfaction,
      weather: state.currentWeather.type,
      revenueBreakdown: result.revenueBreakdown,
      expenseBreakdown: result.expenseBreakdown,
      cvlAnalysis: result.cvlAnalysis,
    };

    // Update reputation based on satisfaction
    const reputationChange = (result.satisfaction - 50) * 0.1;
    const newReputation = Math.min(100, Math.max(0, state.store.reputation + reputationChange));

    // Restock products
    let newState = restockProducts(state);

    // Update staff satisfaction
    newState = updateStaffSatisfaction(newState);

    // Check staff departure
    const { updatedState, departures } = checkStaffDeparture(newState);
    newState = updatedState;

    // Generate new weather for next month
    const nextWeather = generateWeather();

    // Generate new event for next month
    const nextEvent = generateEvent();

    const updatedState2: GameState = {
      ...newState,
      currentMonth: state.currentMonth + 1,
      money: result.newMoney,
      store: {
        ...newState.store,
        reputation: newReputation,
      },
      history: [...state.history, record],
      isGameOver: result.isGameOver,
      isVictory: result.isVictory,
      currentEvent: nextEvent,
      eventHistory: nextEvent ? [...state.eventHistory, nextEvent] : state.eventHistory,
      currentWeather: nextWeather,
    };

    set(updatedState2);
    saveToStorage(updatedState2);
  },

  updateProductPrice: (productId: string, price: number) => {
    const state = get();
    const updatedProducts = state.products.map((p) =>
      p.id === productId ? { ...p, salePrice: Math.max(p.costPrice * 1.1, price) } : p
    );
    const newState = { ...state, products: updatedProducts };
    set(newState);
    saveToStorage(newState);
  },

  updateProductStock: (productId: string, stock: number) => {
    const state = get();
    const updatedProducts = state.products.map((p) =>
      p.id === productId ? { ...p, stock: Math.max(0, stock) } : p
    );
    const newState = { ...state, products: updatedProducts };
    set(newState);
    saveToStorage(newState);
  },

  hireStaff: (name: string, salary: number) => {
    const state = get();
    const newStaff = {
      id: `s${Date.now()}`,
      name,
      salary: Math.max(2500, salary),
      skill: Math.floor(Math.random() * 30) + 40,
      satisfaction: 60,
    };
    const newState = {
      ...state,
      staff: [...state.staff, newStaff],
    };
    set(newState);
    saveToStorage(newState);
  },

  fireStaff: (staffId: string) => {
    const state = get();
    const updatedStaff = state.staff.filter((s) => s.id !== staffId);
    const newState = { ...state, staff: updatedStaff };
    set(newState);
    saveToStorage(newState);
  },

  updateStaffSalary: (staffId: string, salary: number) => {
    const state = get();
    const updatedStaff = state.staff.map((s) =>
      s.id === staffId ? { ...s, salary: Math.max(2000, salary) } : s
    );
    const newState = { ...state, staff: updatedStaff };
    set(newState);
    saveToStorage(newState);
  },

  updateMarketing: (updates: Partial<GameState['marketing']>) => {
    const state = get();
    const newState = {
      ...state,
      marketing: { ...state.marketing, ...updates },
    };
    set(newState);
    saveToStorage(newState);
  },

  negotiateRent: () => {
    const state = get();
    const success = Math.random() < 0.4;
    if (success) {
      const reduction = Math.floor(state.store.rent * 0.1);
      const newState = {
        ...state,
        store: { ...state.store, rent: Math.max(1500, state.store.rent - reduction) },
      };
      set(newState);
      saveToStorage(newState);
    }
  },

  dismissEvent: () => {
    const state = get();
    const newState = { ...state, currentEvent: null };
    set(newState);
    saveToStorage(newState);
  },

  getLeaderboard: () => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  },

  addToLeaderboard: (name: string) => {
    const state = get();
    const entry: LeaderboardEntry = {
      name,
      score: Math.round(state.money + state.store.reputation * 100),
      months: state.currentMonth,
      finalMoney: state.money,
      date: new Date().toISOString(),
      gameMode: state.gameMode,
    };

    const current = get().getLeaderboard();
    const updated = [...current, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  getMonthlyForecast: () => {
    const state = get();
    const result = calculateMonth(state);
    return {
      revenue: result.revenue,
      expenses: result.expenses,
      profit: result.profit,
      customerCount: result.customerCount,
    };
  },

  getForecastDetail: () => {
    const state = get();
    return getForecastDetail(state);
  },
}));
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, Pause } from 'lucide-react';
import StatusBar from '@/components/game/StatusBar';
import ProductPanel from '@/components/game/ProductPanel';
import StaffPanel from '@/components/game/StaffPanel';
import MarketingPanel from '@/components/game/MarketingPanel';
import CostPanel from '@/components/game/CostPanel';
import EventModal from '@/components/game/EventModal';
import FinancePanel from '@/components/game/FinancePanel';
import ForecastPanel from '@/components/game/ForecastPanel';

export default function GamePage() {
  const navigate = useNavigate();
  const { nextMonth, isGameOver, isVictory, gameMode } = useGameStore();

  const handleNextMonth = () => {
    nextMonth();
    const state = useGameStore.getState();
    if (state.isGameOver || state.isVictory) {
      navigate('/result');
    }
  };

  const handleEndGame = () => {
    navigate('/result');
  };

  return (
    <div className="min-h-screen bg-background bg-pattern p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gradient">便利店大亨</h1>
          <div className="flex items-center gap-3">
            {gameMode === 'endless' && (
              <button
                onClick={handleEndGame}
                className="flex items-center gap-2 px-4 py-2 bg-accent-yellow/20 text-accent-yellow rounded-lg hover:bg-accent-yellow/30 transition-colors text-sm font-semibold"
              >
                <Pause className="w-4 h-4" />
                结束经营
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            >
              <LogOut className="w-5 h-5" />
              退出
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar />

        {/* Main Content - Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ProductPanel />
            <StaffPanel />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <MarketingPanel />
            <CostPanel />
            <ForecastPanel />
          </div>
        </div>

        {/* Full Width Finance Panel */}
        <div className="mb-6">
          <FinancePanel />
        </div>

        {/* Next Month Button */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={handleNextMonth}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4 shadow-xl animate-pulse-soft"
          >
            进入下一个月
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Spacer */}
        <div className="h-24" />
      </div>

      {/* Event Modal */}
      <EventModal />
    </div>
  );
}

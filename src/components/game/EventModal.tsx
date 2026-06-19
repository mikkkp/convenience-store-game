import { useGameStore } from '@/store/gameStore';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export default function EventModal() {
  const { currentEvent, dismissEvent } = useGameStore();

  if (!currentEvent) return null;

  const iconMap = {
    positive: CheckCircle,
    negative: AlertTriangle,
    neutral: Info,
    policy: ShieldAlert,
  };

  const colorMap = {
    positive: 'text-accent-green border-accent-green/30 bg-green-50',
    negative: 'text-accent-red border-accent-red/30 bg-red-50',
    neutral: 'text-accent-blue border-accent-blue/30 bg-blue-50',
    policy: 'text-accent-yellow border-accent-yellow/30 bg-yellow-50',
  };

  const Icon = iconMap[currentEvent.type];
  const colors = colorMap[currentEvent.type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl p-6 max-w-md w-full border-2 animate-bounce-in ${colors}`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-8 h-8" />
          <h2 className="text-xl font-bold">{currentEvent.title}</h2>
        </div>

        <p className="text-gray-700 mb-4">{currentEvent.description}</p>

        {currentEvent.effect.moneyChange && (
          <div className={`text-lg font-bold mb-2 ${currentEvent.effect.moneyChange > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {currentEvent.effect.moneyChange > 0 ? '+' : ''}¥{currentEvent.effect.moneyChange}
          </div>
        )}

        {currentEvent.effect.customerMultiplier && (
          <div className="text-lg font-bold mb-2 text-accent-blue">
            客流变化: {currentEvent.effect.customerMultiplier > 1 ? '+' : ''}{Math.round((currentEvent.effect.customerMultiplier - 1) * 100)}%
          </div>
        )}

        {currentEvent.effect.reputationChange && (
          <div className={`text-lg font-bold mb-2 ${currentEvent.effect.reputationChange > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            声誉变化: {currentEvent.effect.reputationChange > 0 ? '+' : ''}{currentEvent.effect.reputationChange}
          </div>
        )}

        <button
          onClick={dismissEvent}
          className="w-full btn-primary mt-4"
        >
          我知道了
        </button>
      </div>
    </div>
  );
}

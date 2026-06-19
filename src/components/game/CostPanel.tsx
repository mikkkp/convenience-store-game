import { useGameStore } from '@/store/gameStore';
import { Home, Zap, MessageSquare, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function CostPanel() {
  const { store, negotiateRent } = useGameStore();
  const [negotiateResult, setNegotiateResult] = useState<string | null>(null);

  const handleNegotiate = () => {
    const prevRent = store.rent;
    negotiateRent();
    const newRent = useGameStore.getState().store.rent;
    if (newRent < prevRent) {
      setNegotiateResult(`谈判成功！房租降低 ¥${prevRent - newRent}`);
    } else {
      setNegotiateResult('谈判失败，房东不同意降价');
    }
    setTimeout(() => setNegotiateResult(null), 3000);
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <Home className="w-5 h-5 text-primary" />
        成本控制
      </h2>

      <div className="space-y-4">
        {/* 房租 */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-secondary">店铺房租</div>
                <div className="text-xs text-gray-500">每月固定支出</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">¥{store.rent}</div>
            </div>
          </div>
          <button
            onClick={handleNegotiate}
            className="w-full py-2 bg-white rounded-lg border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
          >
            <MessageSquare className="w-4 h-4 inline mr-1" />
            与房东谈判降价
          </button>
          {negotiateResult && (
            <div className={`mt-2 text-sm text-center ${negotiateResult.includes('成功') ? 'text-accent-green' : 'text-accent-red'}`}>
              {negotiateResult}
            </div>
          )}
        </div>

        {/* 水电 */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-secondary">水电费用</div>
                <div className="text-xs text-gray-500">每月运营成本</div>
              </div>
            </div>
            <div className="text-lg font-bold text-primary">¥{store.utilities}</div>
          </div>
        </div>

        {/* 店铺信息 */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-secondary">店铺声誉</div>
                <div className="text-xs text-gray-500">影响客流和满意度</div>
              </div>
            </div>
            <div className="text-lg font-bold text-primary">{Math.round(store.reputation)}</div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(0, store.reputation))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

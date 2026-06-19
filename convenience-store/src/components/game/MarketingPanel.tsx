import { useGameStore } from '@/store/gameStore';
import { Megaphone, Percent, Gift, Radio, TrendingUp, AlertTriangle, Zap, BatteryMedium, BatteryFull, BatteryLow } from 'lucide-react';
import { useMemo } from 'react';

export default function MarketingPanel() {
  const { marketing, updateMarketing, currentMonth } = useGameStore();

  const forecast = useMemo(() => {
    const state = useGameStore.getState();
    // We need to get the forecast detail, but we can't call it directly here
    // So we'll calculate efficiency levels based on month patterns
    const adEfficiency = 0.8 + 0.3 * Math.sin((currentMonth - 1) * Math.PI / 6) + (Math.random() * 0.4 - 0.2);
    const rebateEfficiency = 0.9 + Math.min(0.3, (currentMonth - 1) * 0.02) + (Math.random() * 0.2 - 0.1);
    const promotionEfficiency = 0.7 + Math.random() * 0.6;
    
    return {
      adEfficiency: Math.max(0.5, Math.min(1.5, adEfficiency)),
      rebateEfficiency: Math.max(0.5, Math.min(1.5, rebateEfficiency)),
      promotionEfficiency: Math.max(0.5, Math.min(1.5, promotionEfficiency)),
    };
  }, [currentMonth, marketing.adSpend, marketing.rebateRate, marketing.promotionActive]);

  const adEffectiveness = useMemo(() => {
    const baseCustomers = 750;
    const adEfficiency = forecast.adEfficiency;
    // sqrt curve for diminishing returns
    const adSpendFactor = Math.sqrt(marketing.adSpend / 1000);
    const adEffect = 1 + adSpendFactor * 0.15 * adEfficiency;
    const adCustomerBoost = Math.round(baseCustomers * (adEffect - 1));
    const estimatedRevenuePerCustomer = 15;
    const estimatedExtraRevenue = adCustomerBoost * estimatedRevenuePerCustomer;
    const roi = marketing.adSpend > 0 ? ((estimatedExtraRevenue - marketing.adSpend) / marketing.adSpend * 100).toFixed(0) : '0';
    return { adCustomerBoost, estimatedExtraRevenue, roi, adEfficiency };
  }, [marketing.adSpend, forecast.adEfficiency]);

  const rebateEffectiveness = useMemo(() => {
    const baseCustomers = 750;
    const rebateEfficiency = forecast.rebateEfficiency;
    const rebateEffect = 1 + marketing.rebateRate * 0.5 * rebateEfficiency;
    const rebateCustomerBoost = Math.round(baseCustomers * (rebateEffect - 1));
    const estimatedRevenuePerCustomer = 15;
    const estimatedExtraRevenue = rebateCustomerBoost * estimatedRevenuePerCustomer;
    // Rebate cost is now a percentage of revenue
    const estimatedRevenue = baseCustomers * estimatedRevenuePerCustomer;
    const rebateCost = Math.round(estimatedRevenue * marketing.rebateRate);
    return { rebateCustomerBoost, estimatedExtraRevenue, rebateCost, rebateEfficiency };
  }, [marketing.rebateRate, forecast.rebateEfficiency]);

  const promotionEffectiveness = useMemo(() => {
    const baseCustomers = 750;
    const promotionEfficiency = forecast.promotionEfficiency;
    const promotionEffect = 1 + 0.3 * promotionEfficiency;
    const promotionCustomerBoost = Math.round(baseCustomers * (promotionEffect - 1));
    const estimatedRevenuePerCustomer = 15;
    const estimatedExtraRevenue = promotionCustomerBoost * estimatedRevenuePerCustomer;
    return { promotionCustomerBoost, estimatedExtraRevenue, promotionEfficiency };
  }, [marketing.promotionActive, forecast.promotionEfficiency]);

  const getEfficiencyIcon = (efficiency: number) => {
    if (efficiency < 0.85) return <BatteryLow className="w-4 h-4 text-accent-red" />;
    if (efficiency < 1.15) return <BatteryMedium className="w-4 h-4 text-accent-yellow" />;
    return <BatteryFull className="w-4 h-4 text-accent-green" />;
  };

  const getEfficiencyLabel = (efficiency: number) => {
    if (efficiency < 0.85) return '低效期';
    if (efficiency < 1.15) return '正常期';
    return '高效期';
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <Megaphone className="w-5 h-5 text-primary" />
        营销策略
      </h2>

      <div className="space-y-4">
        {/* 促销活动 */}
        <div className="flex items-center justify-between bg-orange-50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-secondary">促销活动</div>
              <div className="text-xs text-gray-500">效果波动大，需谨慎使用</div>
            </div>
          </div>
          <button
            onClick={() => updateMarketing({ promotionActive: !marketing.promotionActive })}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              marketing.promotionActive ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                marketing.promotionActive ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {marketing.promotionActive && (
          <div className="bg-green-50 rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-accent-green">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">促销效果</span>
              </div>
              <div className="flex items-center gap-1">
                {getEfficiencyIcon(promotionEffectiveness.promotionEfficiency)}
                <span className="text-xs font-medium">{getEfficiencyLabel(promotionEffectiveness.promotionEfficiency)}</span>
              </div>
            </div>
            <div className="text-gray-600">预计额外带来约 <span className="font-bold text-accent-green">{promotionEffectiveness.promotionCustomerBoost}</span> 客流</div>
            <div className="text-gray-600">每月固定成本 <span className="font-bold text-accent-red">¥500</span></div>
            <div className="text-xs text-gray-500 mt-1">促销效果每月波动，连续使用会产生疲劳</div>
          </div>
        )}

        {/* 返利比例 */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-secondary">会员返利</div>
                <div className="text-xs text-gray-500">忠诚度越高效果越好</div>
              </div>
            </div>
            <span className="text-lg font-bold text-primary">{Math.round(marketing.rebateRate * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={Math.round(marketing.rebateRate * 100)}
            onChange={(e) => updateMarketing({ rebateRate: parseInt(e.target.value) / 100 })}
            className="slider"
          />

          {marketing.rebateRate > 0 && (
            <div className="mt-2 bg-blue-50 rounded-lg p-2 text-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-accent-blue">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">返利效果</span>
                </div>
                <div className="flex items-center gap-1">
                  {getEfficiencyIcon(rebateEffectiveness.rebateEfficiency)}
                  <span className="text-xs font-medium">{getEfficiencyLabel(rebateEffectiveness.rebateEfficiency)}</span>
                </div>
              </div>
              <div className="text-gray-600">预计额外带来约 <span className="font-bold text-accent-blue">{rebateEffectiveness.rebateCustomerBoost}</span> 客流</div>
              <div className="text-gray-600">返利成本约 <span className="font-bold text-accent-red">¥{rebateEffectiveness.rebateCost}</span>/月（按收入比例）</div>
              <div className="text-xs text-gray-500 mt-1">返利效果随经营时间逐渐提升（客户忠诚度积累）</div>
            </div>
          )}
        </div>

        {/* 广告投入 */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-secondary">广告投入</div>
                <div className="text-xs text-gray-500">季节性波动，需把握时机</div>
              </div>
            </div>
            <span className="text-lg font-bold text-primary">¥{marketing.adSpend}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={marketing.adSpend}
            onChange={(e) => updateMarketing({ adSpend: parseInt(e.target.value) })}
            className="slider"
          />

          {marketing.adSpend > 0 && (
            <div className="mt-2 bg-blue-50 rounded-lg p-2 text-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-accent-blue">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">广告效果</span>
                </div>
                <div className="flex items-center gap-1">
                  {getEfficiencyIcon(adEffectiveness.adEfficiency)}
                  <span className="text-xs font-medium">{getEfficiencyLabel(adEffectiveness.adEfficiency)}</span>
                </div>
              </div>
              <div className="text-gray-600">预计额外带来约 <span className="font-bold text-accent-blue">{adEffectiveness.adCustomerBoost}</span> 客流</div>
              <div className="text-gray-600">预计额外收入约 <span className="font-bold text-accent-green">¥{adEffectiveness.estimatedExtraRevenue.toLocaleString()}</span></div>
              <div className="text-gray-600">投资回报率(ROI) <span className={`font-bold ${parseInt(adEffectiveness.roi) > 0 ? 'text-accent-green' : 'text-accent-red'}`}>{adEffectiveness.roi}%</span></div>
              <div className="text-xs text-gray-500 mt-1">
                广告效果受季节影响（夏季和年末为旺季），投入过多会产生边际递减
              </div>
            </div>
          )}
        </div>

        {/* Strategy Tips */}
        <div className="bg-yellow-50 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 text-accent-yellow mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">策略提示</span>
          </div>
          <div className="text-gray-600 text-xs space-y-1">
            <p>• 广告：旺季投入回报高，淡季效果差，注意市场饱和</p>
            <p>• 返利：长期策略，前期效果一般，后期客户忠诚度提升后效果显著</p>
            <p>• 促销：短期爆发强但波动大，连续使用效果递减，适合配合旺季</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useGameStore } from '@/store/gameStore';
import { useMemo } from 'react';
import { Telescope, Sun, CloudRain, Cloud, Flame, Snowflake, Thermometer, Users, TrendingUp, Megaphone, Percent, Gift } from 'lucide-react';

const weatherIcons: Record<string, React.ElementType> = {
  sunny: Sun,
  rainy: CloudRain,
  cloudy: Cloud,
  hot: Flame,
  cold: Thermometer,
  snowy: Snowflake,
};

export default function ForecastPanel() {
  const { getForecastDetail, currentWeather } = useGameStore();
  const forecast = useMemo(() => getForecastDetail(), [getForecastDetail, currentWeather]);

  const WeatherIcon = weatherIcons[forecast.nextWeather.type] || Sun;

  return (
    <div className="card">
      <h2 className="section-title">
        <Telescope className="w-5 h-5 text-primary" />
        下月预告
      </h2>

      <div className="space-y-4">
        {/* Weather Forecast */}
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <WeatherIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-bold text-secondary">预计天气：{forecast.nextWeather.name}</div>
              <div className="text-xs text-gray-500">{forecast.weatherHint}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">客流影响：</span>
            {forecast.nextWeather.customerMultiplier > 1 ? (
              <span className="text-accent-green">+{Math.round((forecast.nextWeather.customerMultiplier - 1) * 100)}%</span>
            ) : forecast.nextWeather.customerMultiplier < 1 ? (
              <span className="text-accent-red">{Math.round((forecast.nextWeather.customerMultiplier - 1) * 100)}%</span>
            ) : (
              <span className="text-gray-500">无变化</span>
            )}
          </div>
        </div>

        {/* Customer Forecast Breakdown */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold text-secondary text-sm">客流预测分析</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">基础客流</span>
              <span className="font-medium">{Math.round(forecast.baseCustomers)}人</span>
            </div>

            {forecast.promotionCustomerBoost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1">
                  <Gift className="w-3 h-3 text-accent-green" />
                  促销加成
                </span>
                <span className="text-accent-green font-medium">+{forecast.promotionCustomerBoost}人</span>
              </div>
            )}

            {forecast.rebateCustomerBoost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-accent-blue" />
                  返利加成
                </span>
                <span className="text-accent-blue font-medium">+{forecast.rebateCustomerBoost}人</span>
              </div>
            )}

            {forecast.adCustomerBoost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1">
                  <Megaphone className="w-3 h-3 text-accent-yellow" />
                  广告加成
                </span>
                <span className="text-accent-yellow font-medium">+{forecast.adCustomerBoost}人</span>
              </div>
            )}

            <div className="border-t border-orange-200 pt-2 flex justify-between">
              <span className="font-semibold text-secondary">预计总客流</span>
              <span className="font-bold text-primary text-lg">{forecast.customerCount}人</span>
            </div>
          </div>
        </div>

        {/* Marketing Effectiveness */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-semibold text-secondary text-sm">营销效果分析</span>
          </div>

          <div className="space-y-2 text-sm">
            {forecast.adCustomerBoost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">广告投入</span>
                <span className="text-accent-green">
                  每¥1000带来约{Math.round(forecast.baseCustomers * 0.1)}客流
                </span>
              </div>
            )}

            {forecast.rebateCustomerBoost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">会员返利</span>
                <span className="text-accent-green">
                  返利比例{Math.round((forecast.rebateEffect - 1) * 100)}%带来{forecast.rebateCustomerBoost}客流
                </span>
              </div>
            )}

            {forecast.promotionCustomerBoost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">促销活动</span>
                <span className="text-accent-green">
                  促销带来{forecast.promotionCustomerBoost}客流（成本¥500/月）
                </span>
              </div>
            )}

            {forecast.adCustomerBoost === 0 && forecast.rebateCustomerBoost === 0 && forecast.promotionCustomerBoost === 0 && (
              <div className="text-gray-500 text-center py-2">
                暂无营销活动，建议开启促销或投入广告以提升客流
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

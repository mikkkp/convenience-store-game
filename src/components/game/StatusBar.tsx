import { useGameStore } from '@/store/gameStore';
import { DollarSign, Calendar, Users, TrendingUp, TrendingDown, Sun, CloudRain, Cloud, Flame, Snowflake, Thermometer } from 'lucide-react';
import { useMemo } from 'react';

const weatherIcons: Record<string, React.ElementType> = {
  sunny: Sun,
  rainy: CloudRain,
  cloudy: Cloud,
  hot: Flame,
  cold: Thermometer,
  snowy: Snowflake,
};

export default function StatusBar() {
  const { currentMonth, totalMonths, money, store, currentWeather, gameMode, getMonthlyForecast } = useGameStore();
  const forecast = useMemo(() => getMonthlyForecast(), [getMonthlyForecast, currentWeather]);

  const moneyColor = money > 50000 ? 'text-accent-green' : money > 20000 ? 'text-primary' : 'text-accent-red';
  const profitColor = forecast.profit >= 0 ? 'text-accent-green' : 'text-accent-red';
  const ProfitIcon = forecast.profit >= 0 ? TrendingUp : TrendingDown;
  const WeatherIcon = weatherIcons[currentWeather.type] || Sun;

  const monthDisplay = gameMode === 'endless' ? `${currentMonth}` : `${currentMonth}/${totalMonths}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="stat-card">
        <Calendar className="w-6 h-6 text-primary mb-1" />
        <div className="text-2xl font-bold text-secondary">{monthDisplay}</div>
        <div className="text-xs text-gray-500">经营月份</div>
      </div>

      <div className="stat-card">
        <DollarSign className="w-6 h-6 text-primary mb-1" />
        <div className={`text-2xl font-bold ${moneyColor}`}>¥{money.toLocaleString()}</div>
        <div className="text-xs text-gray-500">当前资金</div>
      </div>

      <div className="stat-card">
        <Users className="w-6 h-6 text-primary mb-1" />
        <div className="text-2xl font-bold text-secondary">{forecast.customerCount}</div>
        <div className="text-xs text-gray-500">预计客流</div>
      </div>

      <div className="stat-card">
        <ProfitIcon className={`w-6 h-6 mb-1 ${profitColor}`} />
        <div className={`text-2xl font-bold ${profitColor}`}>
          {forecast.profit >= 0 ? '+' : ''}¥{forecast.profit.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">预计利润</div>
      </div>

      <div className="stat-card">
        <WeatherIcon className="w-6 h-6 text-primary mb-1" />
        <div className="text-lg font-bold text-secondary">{currentWeather.name}</div>
        <div className="text-xs text-gray-500">{currentWeather.description}</div>
      </div>
    </div>
  );
}

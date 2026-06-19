import { useGameStore } from '@/store/gameStore';
import { BarChart3, TrendingUp, TrendingDown, ChevronDown, ChevronUp, PieChart, Activity, DollarSign } from 'lucide-react';
import { useState } from 'react';

type ChartMetric = 'profit' | 'revenue' | 'expenses' | 'customers' | 'cvl';

export default function FinancePanel() {
  const { history } = useGameStore();
  const [hoveredRevenue, setHoveredRevenue] = useState<number | null>(null);
  const [hoveredExpense, setHoveredExpense] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [chartMetric, setChartMetric] = useState<ChartMetric>('profit');
  const [showCVL, setShowCVL] = useState(false);

  const displayHistory = showAll ? history : history.slice(-12);

  const maxProfit = Math.max(...displayHistory.map(h => Math.abs(h.profit)), 1);

  const chartConfig: Record<ChartMetric, { label: string; color: string; getValue: (h: typeof history[0]) => number }> = {
    profit: { label: '利润', color: '#4CAF50', getValue: (h) => h.profit },
    revenue: { label: '收入', color: '#2196F3', getValue: (h) => h.revenue },
    expenses: { label: '支出', color: '#F44336', getValue: (h) => h.expenses },
    customers: { label: '客流', color: '#FF8C42', getValue: (h) => h.customerCount },
    cvl: { label: '边际贡献', color: '#9C27B0', getValue: (h) => h.cvlAnalysis?.contributionMargin || 0 },
  };

  const currentChart = chartConfig[chartMetric];
  const maxChartValue = Math.max(...displayHistory.map(h => Math.abs(currentChart.getValue(h))), 1);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">
          <BarChart3 className="w-5 h-5 text-primary" />
          财务报表
        </h2>
        <div className="flex items-center gap-3">
          {history.length > 12 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
            >
              {showAll ? (
                <>
                  收起 <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  查看全部({history.length}个月) <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无财务数据，开始经营后将显示报表
        </div>
      ) : (
        <div className="space-y-6">
          {/* CVL Analysis Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCVL(!showCVL)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                showCVL ? 'bg-primary text-white' : 'bg-orange-100 text-primary hover:bg-orange-200'
              }`}
            >
              <PieChart className="w-4 h-4" />
              {showCVL ? '隐藏成本量利分析' : '显示成本量利分析'}
            </button>
          </div>

          {/* CVL Analysis Table */}
          {showCVL && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-secondary mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                成本量利分析（最近月份）
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left py-2 px-2 text-secondary font-semibold">月份</th>
                      <th className="text-right py-2 px-2 text-secondary font-semibold">收入</th>
                      <th className="text-right py-2 px-2 text-secondary font-semibold">变动成本</th>
                      <th className="text-right py-2 px-2 text-secondary font-semibold">边际贡献</th>
                      <th className="text-right py-2 px-2 text-secondary font-semibold">边际贡献率</th>
                      <th className="text-right py-2 px-2 text-secondary font-semibold">固定成本</th>
                      <th className="text-right py-2 px-2 text-secondary font-semibold">利润</th>
                      <th className="text-right py-2 px-2 text-secondary font-semibold">盈亏平衡点</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayHistory.slice(-6).map((record) => {
                      const cvl = record.cvlAnalysis;
                      if (!cvl) return null;
                      return (
                        <tr key={record.month} className="border-b border-purple-100 hover:bg-white/50">
                          <td className="py-2 px-2 font-medium">第{record.month}月</td>
                          <td className="py-2 px-2 text-right text-accent-blue">¥{cvl.revenue.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-accent-red">¥{cvl.variableCost.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right font-semibold text-purple-600">¥{cvl.contributionMargin.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-purple-600">{(cvl.contributionMarginRatio * 100).toFixed(1)}%</td>
                          <td className="py-2 px-2 text-right text-gray-600">¥{cvl.fixedCost.toLocaleString()}</td>
                          <td className={`py-2 px-2 text-right font-semibold ${cvl.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {cvl.profit >= 0 ? '+' : ''}¥{cvl.profit.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-right text-gray-500">¥{cvl.breakEvenPoint.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-xs text-gray-600 bg-white/60 rounded-lg p-2">
                <p><strong>变动成本</strong> = 商品进货成本（随销量变化）</p>
                <p><strong>边际贡献</strong> = 收入 - 变动成本（用于覆盖固定成本）</p>
                <p><strong>固定成本</strong> = 工资+房租+水电+广告+促销（不随销量变化）</p>
                <p><strong>盈亏平衡点</strong> = 固定成本 / 边际贡献率（需要多少收入才能保本）</p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-100">
                  <th className="text-left py-3 px-3 text-secondary font-semibold">月份</th>
                  <th className="text-right py-3 px-3 text-secondary font-semibold">收入</th>
                  <th className="text-right py-3 px-3 text-secondary font-semibold">支出</th>
                  <th className="text-right py-3 px-3 text-secondary font-semibold">利润</th>
                  <th className="text-center py-3 px-3 text-secondary font-semibold">天气</th>
                </tr>
              </thead>
              <tbody>
                {displayHistory.map((record) => (
                  <tr key={record.month} className="border-b border-orange-50 hover:bg-orange-50/30 transition-colors">
                    <td className="py-3 px-3 font-medium whitespace-nowrap">第{record.month}月</td>
                    <td
                      className="py-3 px-3 text-right text-accent-green cursor-help relative whitespace-nowrap"
                      onMouseEnter={() => setHoveredRevenue(record.month)}
                      onMouseLeave={() => setHoveredRevenue(null)}
                    >
                      ¥{record.revenue.toLocaleString()}
                      {hoveredRevenue === record.month && record.revenueBreakdown && (
                        <div className="absolute right-0 top-full z-50 bg-white border border-orange-200 rounded-lg shadow-xl p-4 min-w-[240px] mt-1">
                          <div className="text-sm font-semibold text-secondary mb-2">收入构成</div>
                          {Object.entries(record.revenueBreakdown.categoryRevenue)
                            .filter(([, v]) => v > 0)
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, amount]) => (
                              <div key={category} className="flex justify-between text-sm py-1">
                                <span className="text-gray-600">{category}</span>
                                <span className="text-accent-green font-medium">¥{Math.round(amount).toLocaleString()}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </td>
                    <td
                      className="py-3 px-3 text-right text-accent-red cursor-help relative whitespace-nowrap"
                      onMouseEnter={() => setHoveredExpense(record.month)}
                      onMouseLeave={() => setHoveredExpense(null)}
                    >
                      ¥{record.expenses.toLocaleString()}
                      {hoveredExpense === record.month && record.expenseBreakdown && (
                        <div className="absolute right-0 top-full z-50 bg-white border border-orange-200 rounded-lg shadow-xl p-4 min-w-[260px] mt-1">
                          <div className="text-sm font-semibold text-secondary mb-2">支出构成</div>
                          {record.expenseBreakdown.productCost > 0 && (
                            <div className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">商品进货</span>
                              <span className="text-accent-red font-medium">¥{record.expenseBreakdown.productCost.toLocaleString()}</span>
                            </div>
                          )}
                          {record.expenseBreakdown.staffCost > 0 && (
                            <div className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">员工工资</span>
                              <span className="text-accent-red font-medium">¥{record.expenseBreakdown.staffCost.toLocaleString()}</span>
                            </div>
                          )}
                          {record.expenseBreakdown.rent > 0 && (
                            <div className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">店铺房租</span>
                              <span className="text-accent-red font-medium">¥{record.expenseBreakdown.rent.toLocaleString()}</span>
                            </div>
                          )}
                          {record.expenseBreakdown.utilities > 0 && (
                            <div className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">水电费用</span>
                              <span className="text-accent-red font-medium">¥{record.expenseBreakdown.utilities.toLocaleString()}</span>
                            </div>
                          )}
                          {record.expenseBreakdown.adSpend > 0 && (
                            <div className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">广告投入</span>
                              <span className="text-accent-red font-medium">¥{record.expenseBreakdown.adSpend.toLocaleString()}</span>
                            </div>
                          )}
                          {record.expenseBreakdown.promotionCost > 0 && (
                            <div className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">促销成本</span>
                              <span className="text-accent-red font-medium">¥{record.expenseBreakdown.promotionCost.toLocaleString()}</span>
                            </div>
                          )}
                          {record.expenseBreakdown.rebateCost > 0 && (
                            <div className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">返利支出</span>
                              <span className="text-accent-red font-medium">¥{record.expenseBreakdown.rebateCost.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className={`py-3 px-3 text-right font-semibold whitespace-nowrap ${record.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {record.profit >= 0 ? '+' : ''}¥{record.profit.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-xs bg-orange-100 text-primary px-2 py-0.5 rounded-full">
                        {getWeatherName(record.weather)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Line Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-secondary">趋势分析</div>
              <div className="flex items-center gap-2">
                {(Object.keys(chartConfig) as ChartMetric[]).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setChartMetric(metric)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      chartMetric === metric
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {chartConfig[metric].label}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="bg-white rounded-lg border border-orange-100 p-4">
              <svg viewBox={`0 0 ${displayHistory.length * 60} 200`} className="w-full h-48">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 40}
                    x2={displayHistory.length * 60}
                    y2={i * 40}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}

                {/* Zero line */}
                <line
                  x1="0"
                  y1="100"
                  x2={displayHistory.length * 60}
                  y2="100"
                  stroke="#e0e0e0"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />

                {/* Line path */}
                {displayHistory.length > 1 && (
                  <>
                    <path
                      d={displayHistory.map((record, i) => {
                        const value = currentChart.getValue(record);
                        const x = i * 60 + 30;
                        const y = 100 - (value / maxChartValue) * 80;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke={currentChart.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Area fill */}
                    <path
                      d={`
                        ${displayHistory.map((record, i) => {
                          const value = currentChart.getValue(record);
                          const x = i * 60 + 30;
                          const y = 100 - (value / maxChartValue) * 80;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        L ${(displayHistory.length - 1) * 60 + 30} 100
                        L 30 100 Z
                      `}
                      fill={currentChart.color}
                      opacity="0.1"
                    />
                  </>
                )}

                {/* Data points */}
                {displayHistory.map((record, i) => {
                  const value = currentChart.getValue(record);
                  const x = i * 60 + 30;
                  const y = 100 - (value / maxChartValue) * 80;
                  return (
                    <g key={record.month}>
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill={currentChart.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#666"
                      >
                        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                      </text>
                      <text
                        x={x}
                        y="190"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#999"
                      >
                        {record.month}月
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Summary Stats */}
          {displayHistory.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">总收入</div>
                <div className="text-lg font-bold text-accent-green">
                  ¥{displayHistory.reduce((s, h) => s + h.revenue, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">总支出</div>
                <div className="text-lg font-bold text-accent-red">
                  ¥{displayHistory.reduce((s, h) => s + h.expenses, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">总利润</div>
                <div className={`text-lg font-bold ${displayHistory.reduce((s, h) => s + h.profit, 0) >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {displayHistory.reduce((s, h) => s + h.profit, 0) >= 0 ? '+' : ''}¥{displayHistory.reduce((s, h) => s + h.profit, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">月均利润</div>
                <div className={`text-lg font-bold ${(displayHistory.reduce((s, h) => s + h.profit, 0) / displayHistory.length) >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {displayHistory.reduce((s, h) => s + h.profit, 0) >= 0 ? '+' : ''}¥{Math.round(displayHistory.reduce((s, h) => s + h.profit, 0) / displayHistory.length).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getWeatherName(type: string): string {
  const names: Record<string, string> = {
    sunny: '晴',
    rainy: '雨',
    cloudy: '多云',
    hot: '高温',
    cold: '寒冷',
    snowy: '雪',
  };
  return names[type] || type;
}

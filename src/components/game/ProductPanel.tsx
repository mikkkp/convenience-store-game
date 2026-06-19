import { useGameStore } from '@/store/gameStore';
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function ProductPanel() {
  const { products, updateProductPrice, updateProductStock, currentWeather } = useGameStore();
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<string | null>(null);

  const getPriceWarning = (priceRatio: number) => {
    if (priceRatio > 4.0) {
      return { level: 'extreme', message: '价格极高！需求将暴跌至5%以下', color: 'text-accent-red' };
    } else if (priceRatio > 3.0) {
      return { level: 'high', message: '价格过高！需求将大幅下降', color: 'text-accent-red' };
    } else if (priceRatio > 2.5) {
      return { level: 'warning', message: '价格偏高！需求将明显降低', color: 'text-accent-yellow' };
    } else if (priceRatio > 2.0) {
      return { level: 'caution', message: '价格较高！部分消费者会流失', color: 'text-orange-500' };
    } else if (priceRatio < 1.0) {
      return { level: 'low', message: '价格低于成本！亏损销售', color: 'text-accent-red' };
    }
    return null;
  };

  const getWeatherEffect = (category: string) => {
    const effect = currentWeather.productEffects[category];
    if (!effect || effect === 1.0) return null;
    if (effect > 1.5) return { icon: '🔥', text: `需求×${effect.toFixed(1)}`, color: 'text-accent-green' };
    if (effect > 1.0) return { icon: '📈', text: `需求+${Math.round((effect - 1) * 100)}%`, color: 'text-accent-green' };
    if (effect < 0.7) return { icon: '📉', text: `需求-${Math.round((1 - effect) * 100)}%`, color: 'text-accent-red' };
    return { icon: '⚡', text: `需求${effect > 1 ? '+' : ''}${Math.round((effect - 1) * 100)}%`, color: 'text-accent-yellow' };
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <Package className="w-5 h-5 text-primary" />
        商品管理
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-orange-100">
              <th className="text-left py-2 px-2 text-secondary">商品</th>
              <th className="text-center py-2 px-2 text-secondary">类别</th>
              <th className="text-right py-2 px-2 text-secondary">成本</th>
              <th className="text-right py-2 px-2 text-secondary">售价</th>
              <th className="text-right py-2 px-2 text-secondary">利润率</th>
              <th className="text-right py-2 px-2 text-secondary">库存</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const priceRatio = product.salePrice / product.costPrice;
              const profitMargin = ((product.salePrice - product.costPrice) / product.costPrice * 100).toFixed(1);
              const isProfitable = product.salePrice > product.costPrice;
              const priceWarning = getPriceWarning(priceRatio);
              const weatherEffect = getWeatherEffect(product.category);

              return (
                <tr key={product.id} className="border-b border-orange-50 hover:bg-orange-50/50">
                  <td className="py-2 px-2 font-medium text-secondary">
                    <div className="flex items-center gap-1">
                      {product.name}
                      {weatherEffect && (
                        <span className={`text-xs ${weatherEffect.color}`} title={weatherEffect.text}>
                          {weatherEffect.icon}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="text-xs bg-orange-100 text-primary px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right text-gray-600">¥{product.costPrice.toFixed(1)}</td>
                  <td className="py-2 px-2 text-right">
                    {editingPrice === product.id ? (
                      <div className="flex flex-col items-end gap-1">
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={product.salePrice}
                          className="w-20 input-field text-right py-1 text-sm"
                          autoFocus
                          onBlur={(e) => {
                            updateProductPrice(product.id, parseFloat(e.target.value));
                            setEditingPrice(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateProductPrice(product.id, parseFloat((e.target as HTMLInputElement).value));
                              setEditingPrice(null);
                            }
                          }}
                        />
                        {priceWarning && (
                          <span className={`text-xs ${priceWarning.color} flex items-center gap-1`}>
                            <AlertTriangle className="w-3 h-3" />
                            {priceWarning.message}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-end">
                        <button
                          onClick={() => setEditingPrice(product.id)}
                          className={`font-semibold hover:underline ${
                            priceWarning?.level === 'extreme' || priceWarning?.level === 'high' 
                              ? 'text-accent-red' 
                              : priceWarning?.level === 'warning' || priceWarning?.level === 'caution'
                              ? 'text-accent-yellow'
                              : 'text-primary'
                          }`}
                        >
                          ¥{product.salePrice.toFixed(1)}
                        </button>
                        {priceWarning && (
                          <span className={`text-xs ${priceWarning.color} flex items-center gap-1 mt-0.5`}>
                            <AlertTriangle className="w-3 h-3" />
                            {priceWarning.message}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <span className={`flex items-center justify-end gap-1 ${isProfitable ? 'text-accent-green' : 'text-accent-red'}`}>
                      {isProfitable ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {profitMargin}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    {editingStock === product.id ? (
                      <input
                        type="number"
                        defaultValue={product.stock}
                        className="w-20 input-field text-right py-1 text-sm"
                        autoFocus
                        onBlur={(e) => {
                          updateProductStock(product.id, parseInt(e.target.value));
                          setEditingStock(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateProductStock(product.id, parseInt((e.target as HTMLInputElement).value));
                            setEditingStock(null);
                          }
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingStock(product.id)}
                        className={`font-semibold hover:underline ${product.stock < 50 ? 'text-accent-red' : 'text-secondary'}`}
                      >
                        {product.stock}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Price Sensitivity Legend */}
      <div className="mt-4 bg-orange-50 rounded-lg p-3 text-xs text-gray-600">
        <div className="font-semibold text-secondary mb-2 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-primary" />
          价格敏感度说明
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-green"></span>
            <span>1.0-1.5倍成本：最佳定价区间，需求正常</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>1.5-2.0倍成本：需求开始下降</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-yellow"></span>
            <span>2.0-2.5倍成本：需求明显降低</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-red"></span>
            <span>2.5-4.0倍成本：需求大幅下降</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className="w-2 h-2 rounded-full bg-red-700"></span>
            <span>4.0倍以上：需求暴跌至5%以下，几乎无人购买</span>
          </div>
        </div>
        <div className="mt-2 text-gray-500">
          💡 提示：天气影响商品需求时，适度提价（1.5-2.0倍）可获得额外收益，但过高定价会导致客流和销量双降
        </div>
      </div>
    </div>
  );
}

import type { Weather, WeatherType } from '@/types';

export const weatherData: Record<WeatherType, Weather> = {
  sunny: {
    type: 'sunny',
    name: '晴朗',
    description: '阳光明媚，适合出行',
    customerMultiplier: 1.1,
    productEffects: {
      '饮料': 1.15,
      '零食': 1.1,
      '食品': 1.05,
      '日用品': 0.95,
    },
  },
  rainy: {
    type: 'rainy',
    name: '下雨',
    description: '阴雨连绵，客流减少但雨伞热销',
    customerMultiplier: 0.75,
    productEffects: {
      '雨伞': 3.5,
      '饮料': 0.9,
      '零食': 0.85,
      '食品': 1.0,
      '日用品': 1.1,
    },
  },
  cloudy: {
    type: 'cloudy',
    name: '多云',
    description: '天气舒适，客流平稳',
    customerMultiplier: 1.0,
    productEffects: {
      '饮料': 1.0,
      '零食': 1.0,
      '食品': 1.0,
      '日用品': 1.0,
    },
  },
  hot: {
    type: 'hot',
    name: '高温',
    description: '酷暑难耐，饮料和冰品大卖',
    customerMultiplier: 0.85,
    productEffects: {
      '饮料': 2.2,
      '零食': 0.8,
      '食品': 0.75,
      '日用品': 1.05,
    },
  },
  cold: {
    type: 'cold',
    name: '寒冷',
    description: '气温骤降，热饮和方便食品需求增加',
    customerMultiplier: 0.9,
    productEffects: {
      '饮料': 1.3,
      '零食': 1.1,
      '食品': 1.25,
      '日用品': 1.0,
    },
  },
  snowy: {
    type: 'snowy',
    name: '下雪',
    description: '大雪纷飞，客流锐减但部分商品热销',
    customerMultiplier: 0.6,
    productEffects: {
      '雨伞': 2.0,
      '饮料': 0.7,
      '零食': 1.15,
      '食品': 1.3,
      '日用品': 1.2,
    },
  },
};

const weatherWeights: Record<WeatherType, number> = {
  sunny: 30,
  cloudy: 25,
  rainy: 15,
  hot: 12,
  cold: 12,
  snowy: 6,
};

export function generateWeather(): Weather {
  const totalWeight = Object.values(weatherWeights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [type, weight] of Object.entries(weatherWeights)) {
    random -= weight;
    if (random <= 0) {
      return weatherData[type as WeatherType];
    }
  }

  return weatherData.sunny;
}

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Store, Play, RotateCcw, Trophy, HelpCircle, Target, Infinity } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { startNewGame, loadGame } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);

  const handleNewGame = (mode: 'target' | 'endless') => {
    startNewGame(mode);
    navigate('/game');
  };

  const handleContinue = () => {
    const hasSave = loadGame();
    if (hasSave) {
      navigate('/game');
    }
  };

  const hasSave = (() => {
    try {
      return !!localStorage.getItem('convenience-store-save');
    } catch {
      return false;
    }
  })();

  return (
    <div className="min-h-screen bg-background bg-pattern flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Store className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-5xl font-black text-gradient mb-3">
          便利店大亨
        </h1>
        <p className="text-lg text-secondary-light">
          从零开始，打造你的便利店帝国
        </p>
      </div>

      <div className="w-full max-w-md space-y-4 animate-slide-up">
        <button
          onClick={() => setShowModeSelect(true)}
          className="w-full btn-primary flex items-center justify-center gap-3 text-lg"
        >
          <Play className="w-6 h-6" />
          开始新游戏
        </button>

        {hasSave && (
          <button
            onClick={handleContinue}
            className="w-full btn-secondary flex items-center justify-center gap-3 text-lg"
          >
            <RotateCcw className="w-6 h-6" />
            继续游戏
          </button>
        )}

        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full btn-outline flex items-center justify-center gap-3 text-lg"
        >
          <Trophy className="w-6 h-6" />
          排行榜
        </button>

        <button
          onClick={() => setShowHelp(true)}
          className="w-full btn-outline flex items-center justify-center gap-3 text-lg"
        >
          <HelpCircle className="w-6 h-6" />
          游戏说明
        </button>
      </div>

      {showModeSelect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full animate-bounce-in">
            <h2 className="text-2xl font-bold text-secondary mb-6 text-center">选择游戏模式</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleNewGame('target')}
                className="w-full card card-hover flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-secondary text-lg">目标模式</div>
                  <div className="text-sm text-gray-500">36个月内达到10万元目标，或资金耗尽即结束</div>
                </div>
              </button>

              <button
                onClick={() => handleNewGame('endless')}
                className="w-full card card-hover flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Infinity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-secondary text-lg">无限模式</div>
                  <div className="text-sm text-gray-500">无期限经营，挑战最高资金和最长经营时间</div>
                </div>
              </button>

              <button
                onClick={() => setShowModeSelect(false)}
                className="w-full btn-outline"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full animate-bounce-in">
            <h2 className="text-2xl font-bold text-secondary mb-4">游戏说明</h2>
            <div className="space-y-3 text-secondary-light">
              <p>你是一家便利店的店长，需要通过经营决策让店铺盈利壮大。</p>
              <p><strong>核心玩法：</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>调整商品售价和库存</li>
                <li>招聘和管理员工</li>
                <li>设置促销活动和返利</li>
                <li>控制房租和水电成本</li>
                <li>应对各种意外事件</li>
                <li>关注天气变化对商品销售的影响</li>
              </ul>
              <p><strong>天气系统：</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>高温天：饮料销量大增，食品销量下降</li>
                <li>下雨天：客流减少，但雨伞热销</li>
                <li>下雪天：客流锐减，但方便食品和零食需求增加</li>
                <li>晴朗天：客流增加，各类商品销售平稳</li>
              </ul>
              <p><strong>目标模式：</strong>资金达到10万元或完成36个月即胜利，资金耗尽则失败</p>
              <p><strong>无限模式：</strong>无期限经营，挑战最高资金和最长经营时间</p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full btn-primary"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Trophy, Home, RotateCcw, DollarSign, Calendar, TrendingUp, Award, Infinity, Target } from 'lucide-react';
import { useState } from 'react';

export default function ResultPage() {
  const navigate = useNavigate();
  const { isVictory, isGameOver, money, currentMonth, history, store, gameMode, addToLeaderboard, startNewGame } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalProfit = history.reduce((sum, h) => sum + h.profit, 0);
  const avgProfit = history.length > 0 ? totalProfit / history.length : 0;
  const bestMonth = history.reduce((best, h) => (h.profit > best.profit ? h : best), history[0] || { month: 0, profit: 0 });

  const handleSubmit = () => {
    if (playerName.trim()) {
      addToLeaderboard(playerName.trim());
      setSubmitted(true);
    }
  };

  const handleNewGame = () => {
    startNewGame(gameMode);
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-background bg-pattern flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full animate-bounce-in">
        {/* Result Header */}
        <div className="text-center mb-6">
          {isGameOver ? (
            <>
              <Award className="w-16 h-16 text-accent-red mx-auto mb-3" />
              <h1 className="text-3xl font-black text-accent-red">经营失败</h1>
              <p className="text-gray-500 mt-2">资金耗尽，便利店倒闭了...</p>
            </>
          ) : isVictory ? (
            <>
              <Trophy className="w-16 h-16 text-accent-yellow mx-auto mb-3" />
              <h1 className="text-3xl font-black text-accent-green">经营成功！</h1>
              <p className="text-gray-500 mt-2">恭喜你完成了便利店经营挑战</p>
            </>
          ) : (
            <>
              <Trophy className="w-16 h-16 text-accent-yellow mx-auto mb-3" />
              <h1 className="text-3xl font-black text-accent-green">经营结算</h1>
              <p className="text-gray-500 mt-2">你选择了结束经营</p>
            </>
          )}
        </div>

        {/* Game Mode Badge */}
        <div className="flex justify-center mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
            gameMode === 'endless' ? 'bg-primary/10 text-primary' : 'bg-accent-blue/10 text-accent-blue'
          }`}>
            {gameMode === 'endless' ? <Infinity className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            {gameMode === 'endless' ? '无限模式' : '目标模式'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <DollarSign className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-secondary">¥{money.toLocaleString()}</div>
            <div className="text-xs text-gray-500">最终资金</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-secondary">{currentMonth}个月</div>
            <div className="text-xs text-gray-500">经营时长</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-secondary">¥{Math.round(avgProfit).toLocaleString()}</div>
            <div className="text-xs text-gray-500">月均利润</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Award className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-secondary">{Math.round(store.reputation)}</div>
            <div className="text-xs text-gray-500">最终声誉</div>
          </div>
        </div>

        {/* Best Month */}
        {bestMonth.month > 0 && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">最佳月份：第{bestMonth.month}月</div>
            <div className="text-xl font-bold text-accent-green">利润 +¥{bestMonth.profit.toLocaleString()}</div>
          </div>
        )}

        {/* Leaderboard Submit */}
        {!submitted ? (
          <div className="mb-6">
            <input
              type="text"
              placeholder="输入你的名字"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input-field mb-2"
            />
            <button
              onClick={handleSubmit}
              className="w-full btn-primary"
              disabled={!playerName.trim()}
            >
              提交到排行榜
            </button>
          </div>
        ) : (
          <div className="text-center text-accent-green font-semibold mb-6">
            已提交到排行榜！
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={handleNewGame} className="w-full btn-primary flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" />
            再来一局
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            查看排行榜
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full btn-outline flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Trophy, Home, Medal, Crown, Award, Infinity, Target } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { getLeaderboard } = useGameStore();
  const entries = getLeaderboard();

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-accent-yellow" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background bg-pattern p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gradient flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent-yellow" />
            排行榜
          </h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <Home className="w-5 h-5" />
            首页
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="card text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">暂无记录</p>
            <p className="text-gray-400 text-sm mt-1">完成一局游戏后将显示在这里</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={index}
                className={`card flex items-center gap-4 ${
                  index < 3 ? 'border-2' : ''
                } ${
                  index === 0
                    ? 'border-accent-yellow/50 bg-yellow-50/50'
                    : index === 1
                    ? 'border-gray-300/50 bg-gray-50/50'
                    : index === 2
                    ? 'border-amber-600/30 bg-orange-50/50'
                    : ''
                }`}
              >
                <div className="flex-shrink-0">{getRankIcon(index)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-secondary text-lg">{entry.name}</div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      entry.gameMode === 'endless' ? 'bg-primary/10 text-primary' : 'bg-accent-blue/10 text-accent-blue'
                    }`}>
                      {entry.gameMode === 'endless' ? <Infinity className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                      {entry.gameMode === 'endless' ? '无限' : '目标'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.months}个月 · ¥{entry.finalMoney.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-primary">{entry.score}</div>
                  <div className="text-xs text-gray-500">积分</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReactionStore } from '@/stores/reactionStore';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SessionStats {
  totalConfused: number;
  totalMore: number;
  peakConfused: number;
  peakMore: number;
  questionCount: number;
  duration: string;
}

export function AdminPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { recentReactions } = useReactionStore();
  const [syncTime, setSyncTime] = useState<Date | null>(null);
  const [sessionStartTime] = useState<Date>(new Date());
  const [stats, setStats] = useState<SessionStats>({
    totalConfused: 0,
    totalMore: 0,
    peakConfused: 0,
    peakMore: 0,
    questionCount: 0,
    duration: '00:00:00',
  });
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Connect to WebSocket for real-time updates
  const { isConnected, connectionError } = useWebSocket({
    sessionId: sessionId || '',
    onConnect: () => console.log('Admin connected to session:', sessionId),
    onError: (err) => console.error('Admin WebSocket error:', err),
  });

  // Update stats when reactions change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalConfused: prev.totalConfused + recentReactions.confused,
      totalMore: prev.totalMore + recentReactions.more,
      peakConfused: Math.max(prev.peakConfused, recentReactions.confused),
      peakMore: Math.max(prev.peakMore, recentReactions.more),
    }));
  }, [recentReactions.confused, recentReactions.more]);

  // Update duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - sessionStartTime.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setStats(prev => ({
        ...prev,
        duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const handleSyncTimestamp = () => {
    const now = new Date();
    setSyncTime(now);
    // TODO: Send sync timestamp to backend
    console.log('Sync timestamp:', now.toISOString());
  };

  const handleEndSession = async () => {
    if (!confirm('세션을 종료하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsEndingSession(true);
    try {
      // TODO: Call backend API to end session
      console.log('Ending session:', sessionId);
      // Navigate to report view after ending session
      navigate(`/report/${sessionId}`);
    } catch (error) {
      console.error('Failed to end session:', error);
      alert('세션 종료에 실패했습니다.');
    } finally {
      setIsEndingSession(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">세션: {sessionId}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '● 실시간 연결됨' : connectionError || '○ 연결 중...'}
            </span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">🤔 혼란 반응</p>
          <p className="text-3xl font-bold text-amber-600">{recentReactions.confused}</p>
          <p className="text-xs text-gray-400 mt-1">현재 30초간</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">👀 관심 반응</p>
          <p className="text-3xl font-bold text-blue-600">{recentReactions.more}</p>
          <p className="text-xs text-gray-400 mt-1">현재 30초간</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">📊 총 혼란</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalConfused}</p>
          <p className="text-xs text-gray-400 mt-1">피크: {stats.peakConfused}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">📈 총 관심</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalMore}</p>
          <p className="text-xs text-gray-400 mt-1">피크: {stats.peakMore}</p>
        </Card>
      </div>

      {/* Session Info */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">세션 정보</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">진행 시간</p>
            <p className="text-xl font-mono font-bold">{stats.duration}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">시작 시간</p>
            <p className="text-lg">{formatTime(sessionStartTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">마지막 싱크</p>
            <p className="text-lg">{syncTime ? formatTime(syncTime) : '-'}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Sync Timestamp Button */}
        <Button
          onClick={handleSyncTimestamp}
          variant="outline"
          className="flex-1 h-16 text-lg"
        >
          ⏱️ 타임스탬프 동기화
        </Button>

        {/* End Session Button */}
        <Button
          onClick={handleEndSession}
          variant="destructive"
          disabled={isEndingSession}
          className="flex-1 h-16 text-lg"
        >
          {isEndingSession ? '종료 중...' : '🛑 세션 종료'}
        </Button>
      </div>

      {/* Quick Links */}
      <div className="mt-8 flex gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/dashboard/${sessionId}`)}
          className="text-gray-600"
        >
          📺 발표자 화면 보기
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.open(`/s/${sessionId}`, '_blank')}
          className="text-gray-600"
        >
          📱 청중 화면 열기
        </Button>
      </div>
    </div>
  );
}

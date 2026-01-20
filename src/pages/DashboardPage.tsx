import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useReactionStore } from '@/stores/reactionStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { dominantType, recentReactions, glowActive, updateReactions, resetReactions } = useReactionStore();
  const [demoMode, setDemoMode] = useState(false);

  // Connect to WebSocket for real-time updates
  const { isConnected, connectionError } = useWebSocket({
    sessionId: sessionId || '',
    onConnect: () => console.log('Dashboard connected to session:', sessionId),
    onError: (err) => console.error('Dashboard WebSocket error:', err),
  });

  // Per spec: Orange glow rgba(255, 165, 0, 0.6), Blue glow rgba(0, 150, 255, 0.6)
  const getGlowStyle = () => {
    if (!glowActive || !dominantType) {
      return {};
    }

    const color = dominantType === 'confused'
      ? 'rgba(255, 165, 0, 0.6)'
      : 'rgba(0, 150, 255, 0.6)';

    return {
      background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
    };
  };

  // Per spec: Text messages
  const getMessage = () => {
    if (!dominantType || !glowActive) return null;

    if (dominantType === 'confused') {
      return '조금 더 풀어서 설명해주세요';
    } else {
      return '이 부분 더 깊이 다뤄주세요';
    }
  };

  const message = getMessage();

  return (
    // Per spec: Default background dark gray #2D2D2D
    <div className="min-h-screen relative overflow-hidden transition-all duration-300" style={{ backgroundColor: '#2D2D2D' }}>
      {/* Glow Effect - Full screen radial gradient with 300ms fade */}
      <div
        className="absolute inset-0 transition-all duration-300 pointer-events-none"
        style={getGlowStyle()}
      />

      {/* Main Content - Centered message (per spec: no other elements visible) */}
      <main className="min-h-screen flex flex-col items-center justify-center relative z-10">
        {message ? (
          <div className="text-center animate-fade-in">
            <p className="text-3xl font-medium text-white">
              {message}
            </p>
          </div>
        ) : null}
      </main>

      {/* Demo Controls - Only visible in demo mode */}
      {demoMode && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateReactions('confused', recentReactions.confused + 5, 100)}
            className="bg-amber-100 hover:bg-amber-200 text-gray-800"
          >
            🤔 +5
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateReactions('more', recentReactions.more + 5, 100)}
            className="bg-blue-100 hover:bg-blue-200 text-gray-800"
          >
            👀 +5
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetReactions()}
            className="text-gray-800"
          >
            리셋
          </Button>
        </div>
      )}

      {/* Footer with connection status and demo toggle */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 text-xs text-gray-400 z-10">
        <div className="flex justify-center items-center gap-4">
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? '● 연결됨' : connectionError || '○ 연결 중...'}
          </span>
          <span className="text-gray-600">|</span>
          <span>🤔 {recentReactions.confused}점</span>
          <span>👀 {recentReactions.more}점</span>
          <span className="text-gray-600">|</span>
          <span>글로우: {glowActive ? 'ON' : 'OFF'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDemoMode(!demoMode)}
            className="text-xs text-gray-400 hover:text-white"
          >
            {demoMode ? '데모 숨기기' : '데모 모드'}
          </Button>
        </div>
      </footer>
    </div>
  );
}

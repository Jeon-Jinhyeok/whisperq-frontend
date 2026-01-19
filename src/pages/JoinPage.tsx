import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function JoinPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = (index: number, value: string) => {
    // Allow only alphanumeric characters (letters and numbers)
    const sanitized = value.replace(/[^a-zA-Z0-9]/g, '');
    if (sanitized.length > 1) return;

    const newCode = [...code];
    newCode[index] = sanitized.toUpperCase();
    setCode(newCode);

    // Auto-focus next input
    if (sanitized && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleJoin = async () => {
    const sessionCode = code.join('');
    if (sessionCode.length !== 6) {
      setError('6자리 코드를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Verify session code with API
      // For now, just navigate
      navigate(`/s/${sessionCode}`);
    } catch {
      setError('유효하지 않은 코드입니다');
    } finally {
      setIsLoading(false);
    }
  };

  const fullCode = code.join('');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <h1 className="text-3xl font-bold mb-2">whisper-Q</h1>
      <p className="text-muted-foreground mb-8">
        타인의 시선으로부터 자유로운 소통
      </p>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">세션 참여하기</CardTitle>
        </CardHeader>
        <CardContent>
          {/* QR Code Scanner Placeholder */}
          <div className="mb-6">
            <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center text-muted-foreground">
                <p className="text-4xl mb-2">📷</p>
                <p>QR 코드 스캔</p>
                <p className="text-sm">(준비 중)</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">또는</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Code Input */}
          <div className="mb-4">
            <p className="text-sm text-center mb-3">6자리 코드 입력</p>
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-mono"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive text-center mb-4">{error}</p>
          )}

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={isLoading || fullCode.length !== 6}
            className="w-full"
            size="lg"
          >
            {isLoading ? '확인 중...' : '참여하기'}
          </Button>

          {/* Demo Mode */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground mb-3">
              데모 모드 (개발용)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate('/s/DEMO01')}
              >
                청중 화면
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate('/dashboard/DEMO01')}
              >
                진행자 대시보드
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/analysis/DEMO01')}
            >
              분석 화면
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

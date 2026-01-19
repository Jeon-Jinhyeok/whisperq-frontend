import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AnalysisPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sttFile, setSttFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for UI development
  const mockData = {
    totalReactions: 156,
    confused: 89,
    more: 67,
    // Time distribution data (10-minute intervals)
    timeDistribution: [
      { time: '0-10분', confused: 5, more: 3 },
      { time: '10-20분', confused: 12, more: 8 },
      { time: '20-30분', confused: 25, more: 15 },
      { time: '30-40분', confused: 18, more: 20 },
      { time: '40-50분', confused: 15, more: 12 },
      { time: '50-60분', confused: 14, more: 9 },
    ],
    segments: [
      {
        timeRange: '15:30',
        type: 'confused',
        count: 12,
        transcript: '리스타트업에서 MVP를 정의할 때 가장 중요한 건...',
      },
      {
        timeRange: '23:45',
        type: 'more',
        count: 8,
        transcript: '투자자들이 실제로 보는 지표는...',
      },
    ],
    faqs: [
      { question: '투자 유치 타이밍은 언제가 적절한가요?', count: 5 },
      { question: '팀 빌딩 시 공동창업자는 어떻게 찾나요?', count: 3 },
      { question: 'PMF는 어떻게 확인하나요?', count: 4 },
    ],
  };

  // Calculate max value for chart scaling
  const maxReaction = Math.max(
    ...mockData.timeDistribution.map((d) => Math.max(d.confused, d.more))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSttFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!sttFile) return;
    setIsAnalyzing(true);
    // TODO: Upload STT file and fetch analysis
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">분석 결과</h1>
        <p className="text-muted-foreground">세션 ID: {sessionId}</p>
      </header>

      {/* STT Upload */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>STT 데이터 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.srt,.vtt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center gap-3 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <span className="text-2xl">📁</span>
              <div className="text-left">
                <p className="font-medium">
                  {sttFile ? sttFile.name : '파일 선택'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {sttFile
                    ? `${(sttFile.size / 1024).toFixed(1)} KB`
                    : '.txt, .srt, .vtt 파일'}
                </p>
              </div>
            </button>
            <Button onClick={handleAnalyze} disabled={!sttFile || isAnalyzing}>
              {isAnalyzing ? '분석 중...' : '분석 시작'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Google Meet 자막 파일 또는 텍스트 파일을 업로드하세요
          </p>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              총 반응 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockData.totalReactions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              🤔 잘 모르겠어요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-500">
              {mockData.confused}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              🔍 더 듣고 싶어요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{mockData.more}</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Distribution Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>시간대별 분포 (10분 단위)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.timeDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-16 text-sm text-muted-foreground shrink-0">
                  {item.time}
                </span>
                <div className="flex-1 flex gap-1 h-6">
                  {/* Confused bar (orange) */}
                  <div
                    className="bg-amber-400 rounded-l transition-all duration-300"
                    style={{
                      width: `${(item.confused / maxReaction) * 50}%`,
                    }}
                    title={`🤔 ${item.confused}회`}
                  />
                  {/* More bar (blue) */}
                  <div
                    className="bg-blue-400 rounded-r transition-all duration-300"
                    style={{
                      width: `${(item.more / maxReaction) * 50}%`,
                    }}
                    title={`🔍 ${item.more}회`}
                  />
                </div>
                <span className="w-20 text-xs text-muted-foreground text-right shrink-0">
                  {item.confused + item.more}회
                </span>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-400 rounded" />
              <span className="text-sm">🤔 잘 모르겠어요</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded" />
              <span className="text-sm">🔍 더 듣고 싶어요</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reaction Segments */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>구간별 반응 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.segments.map((segment, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  segment.type === 'confused'
                    ? 'border-l-amber-500 bg-amber-50'
                    : 'border-l-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">
                    [{segment.timeRange}]{' '}
                    {segment.type === 'confused'
                      ? '🤔 잘 모르겠어요'
                      : '🔍 더 듣고 싶어요'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {segment.count}회
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "{segment.transcript}"
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>AI 생성 FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.faqs.map((faq, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-secondary rounded-lg"
              >
                <span>
                  Q{index + 1}. {faq.question}
                </span>
                <span className="text-sm text-muted-foreground">
                  (유사 질문 {faq.count}개 통합)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReactionMoment {
  id: string;
  timestamp: string;
  type: 'confused' | 'more';
  count: number;
  transcript?: string;
}

interface Question {
  id: string;
  text: string;
  timestamp: string;
  similarCount: number;
}

export function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sttFile, setSttFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Mock data for demonstration
  const [reactionMoments, setReactionMoments] = useState<ReactionMoment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSttFile(file);
    }
  };

  const handleUpload = async () => {
    if (!sttFile) return;

    setIsProcessing(true);
    try {
      // TODO: Upload file to backend for processing
      console.log('Uploading STT file:', sttFile.name);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis results (top 7 reaction moments per spec)
      setReactionMoments([
        { id: '1', timestamp: '00:05:23', type: 'confused', count: 12, transcript: '머신러닝 모델의 과적합 문제에 대해 설명드리겠습니다...' },
        { id: '2', timestamp: '00:12:45', type: 'more', count: 8, transcript: '이 부분이 핵심 알고리즘입니다...' },
        { id: '3', timestamp: '00:18:30', type: 'confused', count: 15, transcript: '수학적 증명을 살펴보면...' },
        { id: '4', timestamp: '00:25:10', type: 'more', count: 10, transcript: '실제 적용 사례를 보여드리겠습니다...' },
        { id: '5', timestamp: '00:32:55', type: 'confused', count: 7, transcript: '복잡한 데이터 구조에서...' },
        { id: '6', timestamp: '00:40:20', type: 'more', count: 6, transcript: '이 기술의 미래 전망은...' },
        { id: '7', timestamp: '00:45:00', type: 'confused', count: 9, transcript: '성능 최적화 방법론...' },
      ]);

      setQuestions([
        { id: '1', text: '과적합 방지 방법이 궁금합니다', timestamp: '00:06:12', similarCount: 5 },
        { id: '2', text: '실제 업무에서 어떻게 활용하나요?', timestamp: '00:26:30', similarCount: 3 },
        { id: '3', text: '학습 시간은 얼마나 걸리나요?', timestamp: '00:35:45', similarCount: 2 },
        { id: '4', text: '다른 알고리즘과의 차이점은?', timestamp: '00:42:10', similarCount: 4 },
      ]);

      setAnalysisComplete(true);
    } catch (error) {
      console.error('Failed to process STT file:', error);
      alert('파일 처리에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    // TODO: Export report as PDF or other format
    console.log('Exporting report for session:', sessionId);
    alert('리포트 내보내기 기능은 준비 중입니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">세션 리포트</h1>
        <p className="text-sm text-gray-500 mt-1">세션: {sessionId}</p>
      </header>

      {/* STT File Upload Section */}
      {!analysisComplete && (
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">📁 STT 파일 업로드</h2>
          <p className="text-sm text-gray-600 mb-4">
            발표 녹음 파일의 STT(Speech-to-Text) 결과를 업로드하면<br />
            반응 데이터와 매칭하여 분석 리포트를 생성합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.srt,.vtt,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              {sttFile ? `📄 ${sttFile.name}` : '파일 선택'}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!sttFile || isProcessing}
              className="flex-1"
            >
              {isProcessing ? '분석 중...' : '📊 분석 시작'}
            </Button>
          </div>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisComplete && (
        <>
          {/* Top Reaction Moments (per spec: top 7) */}
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">🔥 주요 반응 순간 (Top 7)</h2>
              <Button variant="outline" size="sm" onClick={handleExport}>
                내보내기
              </Button>
            </div>

            <div className="space-y-4">
              {reactionMoments.map((moment, index) => (
                <div
                  key={moment.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    moment.type === 'confused'
                      ? 'bg-amber-50 border-amber-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                        {moment.timestamp}
                      </span>
                      <span className={`text-sm font-medium ${
                        moment.type === 'confused' ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        {moment.type === 'confused' ? '🤔 혼란' : '👀 관심'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {moment.count}회 반응
                    </span>
                  </div>
                  {moment.transcript && (
                    <p className="text-sm text-gray-700 italic">
                      "{moment.transcript}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Questions List */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">❓ 청중 질문 ({questions.length})</h2>

            <div className="space-y-3">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="text-gray-800">{q.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {q.timestamp} • 유사 질문 {q.similarCount}개
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">📈 세션 요약</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">
                  {reactionMoments.filter(m => m.type === 'confused').length}
                </p>
                <p className="text-sm text-gray-600">혼란 포인트</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {reactionMoments.filter(m => m.type === 'more').length}
                </p>
                <p className="text-sm text-gray-600">관심 포인트</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{questions.length}</p>
                <p className="text-sm text-gray-600">질문 수</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">
                  {reactionMoments.reduce((sum, m) => sum + m.count, 0)}
                </p>
                <p className="text-sm text-gray-600">총 반응</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setAnalysisComplete(false);
                setSttFile(null);
                setReactionMoments([]);
                setQuestions([]);
              }}
            >
              🔄 새 파일로 다시 분석
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

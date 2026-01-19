import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ReactionButton } from '@/components/ReactionButton';
import type { ReactionType } from '@/types';

export function AudiencePage() {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReaction = (type: ReactionType) => {
    // TODO: Send reaction via WebSocket
    console.log('Reaction:', type, 'Session:', sessionCode);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Send question to API
      console.log('Question submitted:', question);
      setQuestion('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <p className="text-center text-sm text-muted-foreground">
          익명으로 참여 중
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Reaction Buttons */}
        <div className="flex gap-6">
          <ReactionButton
            type="confused"
            label="잘 모르겠어요"
            emoji="🤔"
            onClick={() => handleReaction('confused')}
          />
          <ReactionButton
            type="more"
            label="더 듣고 싶어요"
            emoji="🔍"
            onClick={() => handleReaction('more')}
          />
        </div>
      </main>

      {/* Question Input */}
      <footer className="p-4 border-t border-border">
        <Card className="p-4">
          <form onSubmit={handleSubmitQuestion} className="flex gap-2">
            <Input
              type="text"
              placeholder="질문을 입력하세요..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting || !question.trim()}>
              전송
            </Button>
          </form>
        </Card>
      </footer>
    </div>
  );
}

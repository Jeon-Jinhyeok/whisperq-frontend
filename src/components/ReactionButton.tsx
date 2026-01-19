import { useState, useCallback } from 'react';
import type { ReactionType } from '@/types';

interface ReactionButtonProps {
  type: ReactionType;
  label: string;
  emoji: string;
  onClick: () => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function ReactionButton({
  type,
  label,
  emoji,
  onClick,
}: ReactionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Get click position relative to button
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Add ripple
      const rippleId = Date.now();
      setRipples((prev) => [...prev, { id: rippleId, x, y }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 600);

      // Trigger scale animation
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);

      // Haptic feedback (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      onClick();
    },
    [onClick]
  );

  const colorClasses =
    type === 'confused'
      ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 active:bg-amber-300'
      : 'bg-blue-100 hover:bg-blue-200 border-blue-300 active:bg-blue-300';

  const rippleColor = type === 'confused' ? 'bg-amber-400' : 'bg-blue-400';

  return (
    <button
      onClick={handleClick}
      className={`
        relative overflow-hidden
        flex flex-col items-center justify-center
        w-36 h-36 rounded-2xl border-2
        transition-all duration-150 ease-out
        ${colorClasses}
        ${isPressed ? 'scale-110' : 'scale-100'}
        active:scale-95
        touch-manipulation
        select-none
      `}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`absolute rounded-full ${rippleColor} opacity-40 animate-ripple pointer-events-none`}
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      <span
        className={`text-5xl mb-2 transition-transform duration-150 ${
          isPressed ? 'scale-125' : 'scale-100'
        }`}
      >
        {emoji}
      </span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

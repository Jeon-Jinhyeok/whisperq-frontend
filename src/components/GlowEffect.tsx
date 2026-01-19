interface GlowEffectProps {
  intensity: number; // 0-100
  color: 'orange' | 'blue';
}

export function GlowEffect({ intensity, color }: GlowEffectProps) {
  if (intensity < 5) return null;

  // Calculate opacity based on intensity (0-100 -> 0-0.8)
  const opacity = Math.min(intensity / 100, 0.8);

  const gradientColor =
    color === 'orange'
      ? `rgba(245, 158, 11, ${opacity})`
      : `rgba(59, 130, 246, ${opacity})`;

  return (
    <>
      {/* Top glow */}
      <div
        className="fixed top-0 left-0 right-0 h-64 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${gradientColor} 0%, transparent 70%)`,
        }}
      />

      {/* Bottom glow */}
      <div
        className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${gradientColor} 0%, transparent 70%)`,
        }}
      />

      {/* Left glow */}
      <div
        className="fixed top-0 bottom-0 left-0 w-64 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 0% 50%, ${gradientColor} 0%, transparent 70%)`,
        }}
      />

      {/* Right glow */}
      <div
        className="fixed top-0 bottom-0 right-0 w-64 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 100% 50%, ${gradientColor} 0%, transparent 70%)`,
        }}
      />

      {/* Pulsing overlay for high intensity */}
      {intensity > 50 && (
        <div
          className="fixed inset-0 pointer-events-none animate-pulse-glow"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${gradientColor} 0%, transparent 50%)`,
            opacity: (intensity - 50) / 100,
          }}
        />
      )}
    </>
  );
}

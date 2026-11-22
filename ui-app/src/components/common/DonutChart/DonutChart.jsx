import { CHART_COLORS } from '@/utils/chartColors';

const STROKE = 22;

/** A ring filled clockwise from the top, the rest in the chart track colour; hand-drawn SVG, theme-aware. */
export function DonutChart({ percent, color, label, size = 168, children }) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0));
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const centre = size / 2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        role="img"
        aria-label={label}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke={CHART_COLORS.track}
          strokeWidth={STROKE}
        />
        <circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={`${(circumference * clamped) / 100} ${circumference}`}
          className="transition-[stroke-dasharray] duration-500"
        />
      </svg>
      {children && (
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {children}
        </span>
      )}
    </div>
  );
}

/**
 * components/ui/spinner.tsx
 * Lightweight accessible spinner component
 */
import React from "react";

export interface SpinnerProps {
  size?: number; // px
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, label = "Loading...", className }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div role="status" aria-live="polite" className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-spin"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          fill="none"
          className="text-gray-300"
        />
        <path
          d={`M ${size / 2} ${strokeWidth} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size / 2}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          className="text-indigo-600"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;

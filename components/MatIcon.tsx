import React from 'react';

interface MatIconProps {
  name: string;
  size?: number;
  color?: string;
  filled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function MatIcon({ name, size = 24, color, filled = false, style, className }: MatIconProps) {
  return (
    <span
      translate="no"
      className={`material-symbols-rounded notranslate${className ? ' ' + className : ''}`}
      style={{
        fontSize: size,
        color: color,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        userSelect: 'none',
        ...style,
      }}
    >
      {name}
    </span>
  );
}

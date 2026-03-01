import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  width?: number | string;
  padding?: number;
  borderColor?: string;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  width = "auto",
  padding = 32,
  borderColor = "rgba(255,255,255,0.08)",
  style,
}) => {
  return (
    <div
      style={{
        width,
        padding,
        background: "rgba(15, 15, 26, 0.85)",
        borderRadius: 16,
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

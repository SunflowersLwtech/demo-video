import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface BodyProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}

export const Body: React.FC<BodyProps> = ({
  children,
  size = 28,
  color = "#a1a1aa",
  weight = 400,
  style,
}) => {
  return (
    <p
      style={{
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        color,
        margin: 0,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
};

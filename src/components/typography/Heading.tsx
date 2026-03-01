import React from "react";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont();

interface HeadingProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  size = 72,
  color = "#e4e4e7",
  style,
}) => {
  return (
    <h1
      style={{
        fontFamily,
        fontSize: size,
        fontWeight: 700,
        color,
        margin: 0,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {children}
    </h1>
  );
};

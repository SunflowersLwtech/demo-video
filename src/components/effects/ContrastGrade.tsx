import React from "react";

interface ContrastGradeProps {
  children: React.ReactNode;
  brightness?: number;
  contrast?: number;
  saturate?: number;
}

export const ContrastGrade: React.FC<ContrastGradeProps> = ({
  children,
  brightness = 1,
  contrast = 1,
  saturate = 1,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`,
      }}
    >
      {children}
    </div>
  );
};

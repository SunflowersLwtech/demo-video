import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const body = loadBody();

export const S03_Premise: React.FC = () => {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Opacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Background 3D table silhouette (simple gradient hint)
  const tableOpacity = interpolate(frame, [50, 120], [0, 0.15], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a14",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Faint circular table silhouette */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "1px solid rgba(255,107,53,0.1)",
          opacity: tableOpacity,
          boxShadow: "0 0 60px rgba(255,107,53,0.05), inset 0 0 60px rgba(255,107,53,0.03)",
        }}
      />

      <div style={{ textAlign: "center", maxWidth: 900, padding: "0 60px" }}>
        <p
          style={{
            fontFamily: heading.fontFamily,
            fontSize: 52,
            color: "#e4e4e7",
            lineHeight: 1.4,
            margin: 0,
            opacity: line1Opacity,
          }}
        >
          Seven AI agents. One table.
        </p>
        <p
          style={{
            fontFamily: heading.fontFamily,
            fontSize: 52,
            color: "#ff6b35",
            lineHeight: 1.4,
            margin: "12px 0",
            opacity: line2Opacity,
          }}
        >
          Everyone has a secret.
        </p>
        <p
          style={{
            fontFamily: body.fontFamily,
            fontSize: 32,
            color: "#a1a1aa",
            lineHeight: 1.4,
            margin: 0,
            opacity: line3Opacity,
          }}
        >
          Not everyone will survive.
        </p>
      </div>
    </div>
  );
};

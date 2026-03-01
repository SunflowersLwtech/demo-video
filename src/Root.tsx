import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { CouncilDemo } from "./Composition";
import { TOTAL_FRAMES, FPS } from "./constants/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CouncilDemo"
        component={CouncilDemo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

import { useCurrentFrame, useVideoConfig, interpolate, type ExtrapolateType } from "remotion";

interface AnimatedValueOptions {
  inputRange: number[];
  outputRange: number[];
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
}

/**
 * Convenience wrapper around Remotion's interpolate.
 * Returns an animated value driven by the current frame.
 */
export function useAnimatedValue({
  inputRange,
  outputRange,
  extrapolateLeft = "clamp",
  extrapolateRight = "clamp",
}: AnimatedValueOptions): number {
  const frame = useCurrentFrame();
  return interpolate(frame, inputRange, outputRange, {
    extrapolateLeft,
    extrapolateRight,
  });
}

/**
 * Returns frame-based time in seconds (useful for trigonometric animations).
 */
export function useTime(): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

"use client";

import { useEffect, useRef, useState } from "react";

import type { PlaybackStatus, VisualizationFrame, VisualizationTimeline } from "@/lib/animation/types";

type PlaybackController<State> = {
  currentFrame: VisualizationFrame<State>;
  frameIndex: number;
  status: PlaybackStatus;
  elapsedMs: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  reset: () => void;
};

export function usePlaybackTimeline<State>(
  timeline: VisualizationTimeline<State>,
  stepDurationMs: number,
): PlaybackController<State> {
  const [frameIndex, setFrameIndex] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("ready");
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedRef = useRef(0);
  const lastFrameIndex = timeline.frames.length - 1;

  function reset() {
    elapsedRef.current = 0;
    setFrameIndex(0);
    setElapsedMs(0);
    setStatus("ready");
  }

  function play() {
    if (lastFrameIndex <= 0) {
      setStatus("completed");
      return;
    }

    if (status === "completed") {
      elapsedRef.current = 0;
      setElapsedMs(0);
      setFrameIndex(0);
    }

    setStatus("playing");
  }

  function pause() {
    if (status === "playing") {
      setStatus("paused");
    }
  }

  function stepForward() {
    if (frameIndex >= lastFrameIndex) {
      setStatus("completed");
      return;
    }

    const nextFrameIndex = frameIndex + 1;
    const nextElapsedMs = elapsedRef.current + stepDurationMs;

    elapsedRef.current = nextElapsedMs;
    setElapsedMs(nextElapsedMs);
    setFrameIndex(nextFrameIndex);
    setStatus(nextFrameIndex >= lastFrameIndex ? "completed" : "paused");
  }

  useEffect(() => {
    reset();
  }, [timeline]);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    if (frameIndex >= lastFrameIndex) {
      setStatus("completed");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextFrameIndex = frameIndex + 1;
      const nextElapsedMs = elapsedRef.current + stepDurationMs;

      elapsedRef.current = nextElapsedMs;
      setElapsedMs(nextElapsedMs);
      setFrameIndex(nextFrameIndex);

      if (nextFrameIndex >= lastFrameIndex) {
        setStatus("completed");
      }
    }, stepDurationMs);

    return () => window.clearTimeout(timeoutId);
  }, [frameIndex, lastFrameIndex, status, stepDurationMs]);

  return {
    currentFrame: timeline.frames[frameIndex] ?? timeline.frames[0],
    frameIndex,
    status,
    elapsedMs,
    play,
    pause,
    stepForward,
    reset,
  };
}


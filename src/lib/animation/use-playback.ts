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

export type PlaybackRunSnapshot<State> = {
  currentFrame: VisualizationFrame<State>;
  frameIndex: number;
  elapsedMs: number;
  status: PlaybackStatus;
  isComplete: boolean;
};

type PlaybackGroupController<Key extends string, State> = {
  runs: Record<Key, PlaybackRunSnapshot<State>>;
  frameIndex: number;
  status: PlaybackStatus;
  elapsedMs: number;
  maxFrameIndex: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  reset: () => void;
};

type PlaybackClock = {
  frameIndex: number;
  status: PlaybackStatus;
  elapsedMs: number;
  getElapsedAtFrame: (frameIndex: number) => number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  reset: () => void;
};

function usePlaybackClock(
  maxFrameIndex: number,
  stepDurationMs: number,
  resetSignal: unknown,
): PlaybackClock {
  const [frameIndex, setFrameIndex] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("ready");
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedRef = useRef(0);
  const elapsedHistoryRef = useRef([0]);

  function reset() {
    elapsedRef.current = 0;
    elapsedHistoryRef.current = [0];
    setFrameIndex(0);
    setElapsedMs(0);
    setStatus("ready");
  }

  function getElapsedAtFrame(targetFrameIndex: number) {
    return elapsedHistoryRef.current[targetFrameIndex] ?? elapsedRef.current;
  }

  function play() {
    if (maxFrameIndex <= 0) {
      setStatus("completed");
      return;
    }

    if (status === "completed") {
      elapsedRef.current = 0;
      elapsedHistoryRef.current = [0];
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
    if (frameIndex >= maxFrameIndex) {
      setStatus("completed");
      return;
    }

    const nextFrameIndex = frameIndex + 1;
    const nextElapsedMs = elapsedRef.current + stepDurationMs;

    elapsedRef.current = nextElapsedMs;
    elapsedHistoryRef.current[nextFrameIndex] = nextElapsedMs;
    setElapsedMs(nextElapsedMs);
    setFrameIndex(nextFrameIndex);
    setStatus(nextFrameIndex >= maxFrameIndex ? "completed" : "paused");
  }

  useEffect(() => {
    reset();
  }, [resetSignal]);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    if (frameIndex >= maxFrameIndex) {
      setStatus("completed");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextFrameIndex = frameIndex + 1;
      const nextElapsedMs = elapsedRef.current + stepDurationMs;

      elapsedRef.current = nextElapsedMs;
      elapsedHistoryRef.current[nextFrameIndex] = nextElapsedMs;
      setElapsedMs(nextElapsedMs);
      setFrameIndex(nextFrameIndex);

      if (nextFrameIndex >= maxFrameIndex) {
        setStatus("completed");
      }
    }, stepDurationMs);

    return () => window.clearTimeout(timeoutId);
  }, [frameIndex, maxFrameIndex, status, stepDurationMs]);

  return {
    frameIndex,
    status,
    elapsedMs,
    getElapsedAtFrame,
    play,
    pause,
    stepForward,
    reset,
  };
}

function getRunStatus(
  status: PlaybackStatus,
  frameIndex: number,
  lastFrameIndex: number,
): PlaybackStatus {
  if (lastFrameIndex <= 0 && status !== "ready") {
    return "completed";
  }

  if (frameIndex >= lastFrameIndex) {
    return "completed";
  }

  return status;
}

export function usePlaybackGroup<Key extends string, State>(
  timelines: Record<Key, VisualizationTimeline<State>>,
  stepDurationMs: number,
): PlaybackGroupController<Key, State> {
  const entries = Object.entries(timelines) as Array<[Key, VisualizationTimeline<State>]>;
  const maxFrameIndex = entries.reduce(
    (maxFrames, [, timeline]) => Math.max(maxFrames, timeline.frames.length - 1),
    0,
  );
  const clock = usePlaybackClock(maxFrameIndex, stepDurationMs, timelines);
  const runs = {} as Record<Key, PlaybackRunSnapshot<State>>;

  entries.forEach(([key, timeline]) => {
    const lastFrameIndex = timeline.frames.length - 1;
    const runFrameIndex = Math.min(clock.frameIndex, Math.max(lastFrameIndex, 0));

    runs[key] = {
      currentFrame: timeline.frames[runFrameIndex] ?? timeline.frames[0],
      frameIndex: runFrameIndex,
      elapsedMs: clock.getElapsedAtFrame(runFrameIndex),
      status: getRunStatus(clock.status, runFrameIndex, lastFrameIndex),
      isComplete: runFrameIndex >= lastFrameIndex,
    };
  });

  return {
    runs,
    frameIndex: clock.frameIndex,
    status: clock.status,
    elapsedMs: clock.elapsedMs,
    maxFrameIndex,
    play: clock.play,
    pause: clock.pause,
    stepForward: clock.stepForward,
    reset: clock.reset,
  };
}

export function usePlaybackTimeline<State>(
  timeline: VisualizationTimeline<State>,
  stepDurationMs: number,
): PlaybackController<State> {
  const lastFrameIndex = timeline.frames.length - 1;
  const clock = usePlaybackClock(lastFrameIndex, stepDurationMs, timeline);

  return {
    currentFrame: timeline.frames[clock.frameIndex] ?? timeline.frames[0],
    frameIndex: clock.frameIndex,
    status: clock.status,
    elapsedMs: clock.elapsedMs,
    play: clock.play,
    pause: clock.pause,
    stepForward: clock.stepForward,
    reset: clock.reset,
  };
}

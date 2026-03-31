"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const frameIndexRef = useRef(0);
  const statusRef = useRef<PlaybackStatus>("ready");
  const elapsedRef = useRef(0);
  const elapsedHistoryRef = useRef([0]);

  const commitState = useCallback((
    nextFrameIndex: number,
    nextElapsedMs: number,
    nextStatus: PlaybackStatus,
  ) => {
    frameIndexRef.current = nextFrameIndex;
    statusRef.current = nextStatus;
    elapsedRef.current = nextElapsedMs;
    setFrameIndex(nextFrameIndex);
    setElapsedMs(nextElapsedMs);
    setStatus(nextStatus);
  }, []);

  const reset = useCallback(() => {
    elapsedHistoryRef.current = [0];
    commitState(0, 0, "ready");
  }, [commitState]);

  function getElapsedAtFrame(targetFrameIndex: number) {
    return elapsedHistoryRef.current[targetFrameIndex] ?? elapsedRef.current;
  }

  const advanceFrames = useCallback((stepCount: number, nextRunningStatus: PlaybackStatus) => {
    const remainingFrames = maxFrameIndex - frameIndexRef.current;

    if (remainingFrames <= 0) {
      if (statusRef.current !== "completed") {
        commitState(frameIndexRef.current, elapsedRef.current, "completed");
      }

      return;
    }

    const appliedSteps = Math.min(stepCount, remainingFrames);
    const nextFrameIndex = frameIndexRef.current + appliedSteps;
    let nextElapsedMs = elapsedRef.current;

    for (let step = 1; step <= appliedSteps; step += 1) {
      nextElapsedMs += stepDurationMs;
      elapsedHistoryRef.current[frameIndexRef.current + step] = nextElapsedMs;
    }

    commitState(
      nextFrameIndex,
      nextElapsedMs,
      nextFrameIndex >= maxFrameIndex ? "completed" : nextRunningStatus,
    );
  }, [commitState, maxFrameIndex, stepDurationMs]);

  function play() {
    if (maxFrameIndex <= 0) {
      commitState(frameIndexRef.current, elapsedRef.current, "completed");
      return;
    }

    if (statusRef.current === "completed") {
      elapsedHistoryRef.current = [0];
      commitState(0, 0, "ready");
    }

    statusRef.current = "playing";
    setStatus("playing");
  }

  function pause() {
    if (statusRef.current === "playing") {
      statusRef.current = "paused";
      setStatus("paused");
    }
  }

  function stepForward() {
    advanceFrames(1, "paused");
  }

  useEffect(() => {
    reset();
  }, [reset, resetSignal]);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    if (frameIndexRef.current >= maxFrameIndex) {
      commitState(frameIndexRef.current, elapsedRef.current, "completed");
      return;
    }

    let animationFrameId = 0;
    let previousTimestamp = 0;
    let bufferedMs = 0;

    const tick = (timestamp: number) => {
      if (statusRef.current !== "playing") {
        return;
      }

      if (previousTimestamp === 0) {
        previousTimestamp = timestamp;
      }

      bufferedMs += timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      if (bufferedMs >= stepDurationMs) {
        const stepsToAdvance = Math.floor(bufferedMs / stepDurationMs);

        bufferedMs -= stepsToAdvance * stepDurationMs;
        advanceFrames(stepsToAdvance, "playing");
      }

      if (statusRef.current === "playing") {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [advanceFrames, commitState, maxFrameIndex, status, stepDurationMs]);

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

import type {
  VisualizationEvent,
  VisualizationFrame,
  VisualizationTimeline,
} from "@/lib/animation/types";

type TimelineBuilderOptions<State> = {
  initialState: State;
  events: VisualizationEvent[];
  reducer: (state: State, event: VisualizationEvent) => State;
};

export function buildTimeline<State>({
  initialState,
  events,
  reducer,
}: TimelineBuilderOptions<State>): VisualizationTimeline<State> {
  const frames: VisualizationFrame<State>[] = [
    {
      step: 0,
      event: null,
      state: initialState,
    },
  ];

  let currentState = initialState;

  events.forEach((event, index) => {
    currentState = reducer(currentState, event);
    frames.push({
      step: index + 1,
      event,
      state: currentState,
    });
  });

  return {
    events,
    frames,
  };
}


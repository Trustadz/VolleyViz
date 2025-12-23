
import { useReducer, useEffect, useCallback } from 'react';
import { TacticModel } from '../models/TacticModel';
import { PlayerPositions, Coordinate, Ball } from '../types';

interface OverridesData {
    positions: PlayerPositions;
    balls: Ball[];
}

interface EngineState {
  stepId: string;
  history: Array<{ stepId: string; overrides: OverridesData | null }>;
  overrides: OverridesData | null;
  isPlaying: boolean;
  flashError: boolean;
  showZones: boolean;
  showArrows: boolean;
}

type EngineAction = 
  | { type: 'INIT'; payload: string }
  | { type: 'NEXT'; payload: string }
  | { type: 'PREV' }
  | { type: 'INTERACTION'; payload: { nextStepId: string; overrides: OverridesData } }
  | { type: 'ERROR' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'STOP_PLAY' }
  | { type: 'SET_ZONES'; payload: boolean }
  | { type: 'SET_ARROWS'; payload: boolean };

const engineReducer = (state: EngineState, action: EngineAction): EngineState => {
  switch (action.type) {
    case 'INIT':
      return { ...state, stepId: action.payload, history: [], overrides: null, isPlaying: false };
    case 'NEXT':
      return {
        ...state,
        history: [...state.history, { stepId: state.stepId, overrides: state.overrides }],
        stepId: action.payload,
        overrides: null,
      };
    case 'PREV':
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...state,
        history: state.history.slice(0, -1),
        stepId: prev.stepId,
        overrides: prev.overrides,
        isPlaying: false
      };
    case 'INTERACTION':
      return {
        ...state,
        history: [...state.history, { stepId: state.stepId, overrides: state.overrides }],
        stepId: action.payload.nextStepId,
        overrides: action.payload.overrides,
        isPlaying: false
      };
    case 'ERROR':
      return { ...state, flashError: true, isPlaying: false };
    case 'CLEAR_ERROR':
      return { ...state, flashError: false };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'STOP_PLAY':
      return { ...state, isPlaying: false };
    case 'SET_ZONES':
      return { ...state, showZones: action.payload };
    case 'SET_ARROWS':
      return { ...state, showArrows: action.payload };
    default:
      return state;
  }
};

export const usePlaybackEngine = (model: TacticModel, animationSpeed: number) => {
  const [state, dispatch] = useReducer(engineReducer, {
    stepId: model.steps[0]?.id || '',
    history: [],
    overrides: null,
    isPlaying: false,
    flashError: false,
    showZones: false,
    showArrows: false
  });

  // Derived State Helpers
  const currentStepRaw = model.getStep(state.stepId);
  const nextStep = model.getNextStep(state.stepId);
  
  // Merge overrides for View consumption
  const currentStep = currentStepRaw ? {
      ...currentStepRaw,
      positions: { ...currentStepRaw.positions, ...(state.overrides?.positions || {}) },
      balls: state.overrides?.balls || currentStepRaw.balls
  } : undefined;

  // Error Flash Timer
  useEffect(() => {
    if (state.flashError) {
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_ERROR' }), 300);
      return () => clearTimeout(timer);
    }
  }, [state.flashError]);

  // Animation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state.isPlaying) {
      if (nextStep) {
        interval = setInterval(() => { 
          dispatch({ type: 'NEXT', payload: nextStep.id });
        }, animationSpeed);
      } else {
        dispatch({ type: 'STOP_PLAY' });
      }
    }
    return () => clearInterval(interval);
  }, [state.isPlaying, nextStep, animationSpeed]);

  // Re-init if model changes drastically
  useEffect(() => {
      if (model.steps[0] && !model.getStep(state.stepId)) {
          dispatch({ type: 'INIT', payload: model.steps[0].id });
      }
  }, [model]);

  // Actions
  const restart = () => dispatch({ type: 'INIT', payload: model.steps[0].id });
  const prev = () => dispatch({ type: 'PREV' });
  const next = () => nextStep && dispatch({ type: 'NEXT', payload: nextStep.id });
  
  const togglePlay = () => {
    if (!state.isPlaying && !nextStep) {
        restart();
        setTimeout(() => dispatch({ type: 'TOGGLE_PLAY' }), 10);
    } else {
        dispatch({ type: 'TOGGLE_PLAY' });
    }
  };

  const interact = useCallback((coord: Coordinate) => {
      const result = model.resolveInteraction(state.stepId, coord);
      if (result.isValid && result.nextStepId && result.overrides) {
          dispatch({ type: 'INTERACTION', payload: { nextStepId: result.nextStepId, overrides: result.overrides } });
      } else {
          dispatch({ type: 'ERROR' });
      }
  }, [model, state.stepId]);

  return {
    state,
    currentStep,
    nextStep,
    actions: {
        restart,
        prev,
        next,
        togglePlay,
        interact,
        setZones: (v: boolean) => dispatch({ type: 'SET_ZONES', payload: v }),
        setArrows: (v: boolean) => dispatch({ type: 'SET_ARROWS', payload: v })
    }
  };
};

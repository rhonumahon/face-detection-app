import { createReducer, on } from '@ngrx/store';
import * as SearchActions from './search.actions';
import { initialState } from './search.state';

export const searchReducer = createReducer(
  initialState,
  
  on(SearchActions.uploadImage, (state, { image }) => ({
    ...state,
    detectionResults: null,
    image,
    error: null,
    isLoading: true,
  })),

  on(SearchActions.detectFaceSuccess, (state, { detectionResults }) => {
    if (!detectionResults || !detectionResults.results?.length) {
      return {
        ...state,
        error: 'No faces detected.',
        isLoading: false,
      };
    }

    const validDetectionResults = detectionResults.results[0];
    const updatedHistory = state.history.some(item => item.image === state.image)
      ? state.history
      : [
          ...state.history,
          {
            image: state.image!,
            detectionResults: detectionResults,
            id: validDetectionResults.id,
          }
        ];

    return {
      ...state,
      detectionResults: validDetectionResults,
      history: updatedHistory,
      error: null,
      isLoading: false,
    };
  }),

  on(SearchActions.updateImage, (state, { image }) => ({
    ...state,
    image,
    isLoading: true,
  })),

  on(SearchActions.detectFaceFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);

import { createReducer, on } from '@ngrx/store';
import { initialState, SearchState } from './search.state';
import * as SearchActions from './search.actions';

export const searchReducer = createReducer(
  initialState,
  on(SearchActions.uploadImage, (state, { image }) => ({ ...state, image, error: null })),
  on(SearchActions.detectFaceSuccess, (state, { detectionResults }) => ({
    ...state,
    detectionResults,
    history: [...state.history, { image: state.image!, detectionResults }],
    error: null,
  })),
  on(SearchActions.detectFaceFailure, (state, { error }) => ({ ...state, error })),
);

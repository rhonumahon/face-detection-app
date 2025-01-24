import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { SearchState } from './search.state';

export const selectSearchState = createFeatureSelector<AppState, SearchState>('search');

export const selectImage = createSelector(
  selectSearchState,
  (state: SearchState) => state.image
);

export const selectDetectionResults = createSelector(
  selectSearchState,
  (state: SearchState) => state.detectionResults
);

export const selectHistory = createSelector(
  selectSearchState,
  (state: SearchState) => state.history
);

export const selectError = createSelector(
  selectSearchState,
  (state: SearchState) => state.error
);

export const selectIsLoading = (state: AppState) => state.search.isLoading;

import { createSelector } from '@ngrx/store';

// Assuming your state structure looks something like this
export const selectSearchState = (state: any) => state.search;

export const selectImageData = createSelector(
  selectSearchState,
  (searchState: any) => {
  console.log('searchState :', searchState);
    return searchState.selectedImage
  } // Adjust according to your actual state structure
);

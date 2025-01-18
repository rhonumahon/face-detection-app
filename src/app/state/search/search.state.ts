export interface SearchState {
  image: string | null;
  detectionResults: any;
  history: { image: string; detectionResults: any; id: string }[];
  error: string | null;
  isLoading: boolean;
}

export const initialState: SearchState = {
  image: null,
  detectionResults: null,
  history: [],
  error: null,
  isLoading: false,
};

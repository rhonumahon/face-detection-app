export interface SearchState {
    image: string | null;
    detectionResults: any;
    error: string | null;
    history: { image: string; detectionResults: any }[];
  }
  
  export const initialState: SearchState = {
    image: null,
    detectionResults: null,
    error: null,
    history: [],
  };
  
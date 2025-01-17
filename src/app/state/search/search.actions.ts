import { createAction, props } from '@ngrx/store';

export const uploadImage = createAction('[Search] Upload Image', props<{ image: string }>());
export const detectFaceSuccess = createAction('[Search] Detect Face Success', props<{ detectionResults: any }>());
export const detectFaceFailure = createAction('[Search] Detect Face Failure', props<{ error: string }>());
export const addToHistory = createAction('[Search] Add To History', props<{ image: string; detectionResults: any }>());

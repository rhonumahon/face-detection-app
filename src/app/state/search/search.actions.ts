import { createAction, props } from '@ngrx/store';

export const uploadImage = createAction('[Search] Upload Image', props<{ image: string; isHistoryRestore?: boolean }>());
export const detectFaceSuccess = createAction('[Search] Detect Face Success', props<{ detectionResults: any }>());
export const updateImage = createAction('[Search] Update Image', props<{ image: string | null }>());
export const detectFaceFailure = createAction('[Search] Detect Face Failure', props<{ error: string }>());

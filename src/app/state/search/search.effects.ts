import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as SearchActions from './search.actions';
import { SearchService } from 'src/app/services/search.service';
import { IResults } from 'src/app/interfaces/image.interface';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private searchService: SearchService) {}

  detectFace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.uploadImage),
      mergeMap(({ image, isHistoryRestore }) => {
        if (isHistoryRestore) {
          return of(SearchActions.detectFaceSuccess({ detectionResults: null }));
        }

        return this.searchService.detectFace(image).pipe(
          map((response: IResults) => {
            if (response?.results?.length > 1) {
              const errorMessage = `Multiple faces detected (${response.results.length}). Please upload an image with only one face.`;
              return SearchActions.detectFaceFailure({ error: errorMessage });
            }
            return SearchActions.detectFaceSuccess({ detectionResults: response });
          }),
          catchError((error) => this.handleError(error))
        );
      })
    )
  );

  private handleError(error: any) {
    let errorMessage = 'An error occurred while detecting the face. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = 'The API endpoint was not found.';
          break;
        case 500:
          errorMessage = 'Server error, please try again later.';
          break;
        case 400:
          errorMessage = 'Invalid request parameters.';
          break;
        default:
          errorMessage = `Unexpected error: ${error.statusText}`;
      }
    }

    return of(SearchActions.detectFaceFailure({ error: errorMessage }));
  }
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as SearchActions from './search.actions';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  detectFace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.uploadImage),
      mergeMap(({ image }) =>
        this.http.post('/detect', { sourceUrl: image }).pipe(
          map((response: any) => SearchActions.detectFaceSuccess({ detectionResults: response })),
          catchError((error) =>
            of(SearchActions.detectFaceFailure({ error: 'Face detection failed.' }))
          )
        )
      )
    )
  );
  
  
}

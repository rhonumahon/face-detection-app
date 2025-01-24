import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as SearchActions from 'src/app/state/search/search.actions';
import { selectError, selectHistory } from 'src/app/state/search/search.selectors';
import { SearchState } from 'src/app/state/search/search.state';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  history$: Observable<{ image: string; detectionResults: any; id: string }[]> = this.store.select(selectHistory);
  error$: Observable<string | null> = this.store.select(selectError);

  constructor(private store: Store<{ search: SearchState }>) {}

  restoreHistory(index: number) {
    this.history$.subscribe((history) => {
      const selectedItem = history[index];
  
      if (selectedItem && selectedItem.image && selectedItem.detectionResults) {
        this.store.dispatch(SearchActions.updateImage({ image: selectedItem.image }));
        this.store.dispatch(
          SearchActions.detectFaceSuccess({
            detectionResults: selectedItem.detectionResults,
          })
        );
      } else {
        this.store.dispatch(
          SearchActions.detectFaceFailure({ error: 'Invalid history item selected.' })
        );
      }
    });
  }
}

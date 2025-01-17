import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { uploadImage, detectFaceSuccess } from 'src/app/state/search/search.actions';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  history: { image: string; detectionResults: any }[] = [];

  constructor(private store: Store<{ search: any }>) {
    this.store.select('search').subscribe((state) => {
      this.history = state.history;
    });
  }

  restoreHistory(index: number) {
    const selectedItem = this.history[index];
    this.store.dispatch(uploadImage({ image: selectedItem.image }));
    this.store.dispatch(detectFaceSuccess({ detectionResults: selectedItem.detectionResults }));
  }
}


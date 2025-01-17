import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {
  image: string | null = null;
  detectionResults: any = null;

  constructor(private store: Store<{ search: any }>) {
    this.store.select('search').subscribe((state) => {
      this.image = state.image;
      this.detectionResults = state.detectionResults;
    });
  }
}


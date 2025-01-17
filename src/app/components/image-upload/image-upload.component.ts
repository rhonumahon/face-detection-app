
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { uploadImage } from 'src/app/state/search/search.actions';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  selectedImage: string | null = null;
  error: string | null = null;

  constructor(private store: Store<{ search: any }>) {
    this.store.select('search').subscribe((state) => {
      this.error = state.error;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (this.selectedImage) {
      this.store.dispatch(uploadImage({ image: this.selectedImage }));
    }
  }
}

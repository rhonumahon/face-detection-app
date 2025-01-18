import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { uploadImage } from 'src/app/state/search/search.actions';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  selectedImage: string | null = null;
  error$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    this.error$ = this.store.select(state => state.search.error);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!this.isValidImage(file)) {
        this.error$ = new Observable((observer) => {
          observer.next('Selected file is not a valid image.');
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        this.error$ = new Observable((observer) => observer.next(null));
      };

      reader.onerror = (error) => {
        this.error$ = new Observable((observer) => {
          observer.next('Error reading file.');
        });
        console.error('Error reading file:', error);
      };

      reader.readAsDataURL(file);
    }
  }

  private isValidImage(file: File): boolean {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validImageTypes.includes(file.type);
  }

  uploadImage(): void {
    if (!this.selectedImage) {
      this.error$ = new Observable((observer) => observer.next('No image selected.'));
      return;
    }

    this.store.dispatch(uploadImage({ image: this.selectedImage }));
  }
}

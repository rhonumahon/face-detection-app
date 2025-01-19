import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter, switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { selectImage, selectDetectionResults, selectIsLoading } from 'src/app/state/search/search.selectors';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements AfterViewInit, OnDestroy {
  image$: Observable<string | null>;
  detectionResults$: Observable<any>;
  isLoading$: Observable<boolean>;
  private destroy$ = new Subject<void>();
  errorMessage: string | null = null;

  imageStyle: { [key: string]: string } = {};

  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  constructor(
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {
    this.image$ = this.store.select(selectImage);
    this.detectionResults$ = this.store.select(selectDetectionResults);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.subscribeToImageAndDetectionResults();
  }

  private subscribeToImageAndDetectionResults(): void {
    this.isLoading$
      .pipe(
        takeUntil(this.destroy$),
        filter((isLoading) => !isLoading),
        switchMap(() => this.image$)
      )
      .subscribe(
        (image) => {
          if (this.imageElement && image) {
            const imgElement = this.imageElement.nativeElement;
  
            this.setImageStyle(imgElement);
  
            const canvas = this.canvasElement.nativeElement;
            const context = canvas.getContext('2d');
            context?.clearRect(0, 0, canvas.width, canvas.height);
  
            imgElement.src = image;
  
            if (imgElement.complete && imgElement.naturalHeight !== 0) {
              this.updateCanvasImmediately();
            }
  
            imgElement.onload = () => {
              this.updateCanvasImmediately();
            };
          }
        },
        (error) => {
          this.handleError('Failed to load the image.');
          console.error('Error loading image:', error);
        }
      );
  }  
  
  private setImageStyle(imgElement: HTMLImageElement): void {
    const aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight;

    if (aspectRatio > 1) {
      this.imageStyle = { width: '100%', height: 'auto' };
    } else if (aspectRatio < 1) {
      this.imageStyle = { width: 'auto', height: '100%' };
    } else {
      this.imageStyle = { width: '100%', height: '100%' };
    }
  }

  private updateCanvasImmediately(): void {
    setTimeout(() => {
      this.detectionResults$
        .pipe(
          takeUntil(this.destroy$),
          filter((detectionResults) => !!detectionResults)
        )
        .subscribe((detectionResults) => {
          this.updateCanvas(detectionResults);
        });
    }, 100);
  }

  private updateCanvas(detectionResults: any): void {
    if (!this.imageElement || !this.canvasElement || !detectionResults?.rectangle) {
      return;
    }
  
    try {
      const image = this.imageElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d')!;
  
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      const rectangle = detectionResults.rectangle;
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      const displayedWidth = image.width;
      const displayedHeight = image.height;
  
      const xScale = displayedWidth / imageWidth;
      const yScale = displayedHeight / imageHeight;
  
      const scaledLeft = rectangle.left * xScale;
      const scaledTop = rectangle.top * yScale;
      const scaledWidth = (rectangle.right - rectangle.left) * xScale;
      const scaledHeight = (rectangle.bottom - rectangle.top) * yScale;
  
      canvas.width = displayedWidth;
      canvas.height = displayedHeight;
  
      context.beginPath();
      context.lineWidth = 5; 
      context.strokeStyle = 'green'; 
      context.rect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
      context.stroke();
    } catch (error) {
      this.handleError('Error updating the canvas.');
      console.error('Error updating canvas:', error);
    }
  }
  

  private handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateCanvasWithResize();
  }

  private updateCanvasWithResize(): void {
    this.detectionResults$
      .pipe(
        takeUntil(this.destroy$),
        filter((detectionResults) => !!detectionResults)
      )
      .subscribe((detectionResults) => {
        this.updateCanvas(detectionResults);
      });
  }
}

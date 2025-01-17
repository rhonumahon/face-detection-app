import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { HistoryComponent } from './components/history/history.component';
import { SearchEffects } from './state/search/search.effects';
import { searchReducer } from './state/search/search.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ImageUploadComponent,
    ImagePreviewComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ search: searchReducer }),
    EffectsModule.forRoot([SearchEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

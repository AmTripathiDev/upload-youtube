import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './container/upload.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from './services/alert-service';
import { YoutubeService } from './services/youtube-service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MenubarModule } from 'primeng/menubar';
import { MaterialModule } from './material.module';
import { YoutubeUploadComponent } from './dialog/youtube-upload-components';

@NgModule({
  declarations: [AppComponent, UploadComponent, YoutubeUploadComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    HttpClientModule,
    MatButtonModule,
    ButtonModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),
    MenubarModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [AlertService, YoutubeService],
  bootstrap: [AppComponent],
})
export class AppModule {}

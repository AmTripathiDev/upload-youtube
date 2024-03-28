import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

const data = [
  FileUploadModule,
  ToastModule,
  SplitButtonModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  FormsModule,
  ReactiveFormsModule,
  MatInputModule,
  CommonModule,
  DialogModule,
  MatRadioModule,
  MatProgressBarModule,
  BrowserAnimationsModule,
  MatDialogModule,
];

@NgModule({
  declarations: [],
  imports: [data],
  exports: [data],
  providers: [],
  bootstrap: [],
})
export class MaterialModule {}

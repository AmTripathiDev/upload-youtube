import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { YoutubeUploadComponent } from '../dialog/youtube-upload-components';

@Component({
  selector: 'app-upload-video',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.css'],
})
export class UploadComponent {
  @ViewChild('videoFile') NativeSelectInput: ElementRef<any> | undefined;
  @ViewChild('video') videoElement: any;
  openDialog: boolean = false;
  videoUrl: string = '';
  videoSelected: boolean = false;
  isUpload: boolean = false;
  file: any;
  UploadedVideoUrl: string = '';
  constructor(private dialog: MatDialog) {}

  SelectVideo(data: any) {
    this.videoSelected = true;
    if (navigator.userAgent.search('firefox')) {
      this.file = data.target.files[0];
    } else {
      this.file = data.srcElement.files[0];
    }
    this.videoUrl = window.URL.createObjectURL(this.file);
    this.videoElement.nativeElement.src = this.videoUrl;
  }

  PickFile() {
    console.log('clicked is working ');
    this.NativeSelectInput?.nativeElement.click();
  }

  Delete() {
    this.videoUrl = '';
  }

  UploadToSubmit() {
    const dialogRef = this.dialog.open(YoutubeUploadComponent, {
      data: this.file,
      height: '75%',
      width: '70%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`youtubeURL: ${result}`);
      this.UploadedVideoUrl = result;
      this.isUpload = false;
    });
  }

  reload() {
    window.location.reload();
  }
}

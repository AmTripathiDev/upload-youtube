import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { YoutubeService } from '../services/youtube-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../services/alert-service';

enum YoutubeUrls {
  YoutubeUrl = 'https://www.googleapis.com/auth/youtube',
  YoutubeUploadUrl = 'https://www.googleapis.com/auth/youtube.upload',
}

@Component({
  selector: 'app-youtube-upload',
  templateUrl: 'youtube-upload-component.html',
  styleUrls: ['youtube-upload-component.css'],
})
export class YoutubeUploadComponent implements OnInit {
  userProfile: any;
  authCheck: boolean = false;
  subscription!: Subscription;
  videoForm: FormGroup;
  percentageUpload = 0;
  loading: boolean = false;
  videoUrl: string = '';
  userPermission: string[] = [];
  YoutubePermission: boolean | null = null;
  constructor(
    public YoutubeService: YoutubeService,
    public dialogRef: MatDialogRef<YoutubeUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: File,
    private alertService: AlertService
  ) {
    this.videoForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      PrivacyStatus: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.Authorize();
    this.AuthenticateUserProfile();
    this.AuthUser();
  }

  Authorize() {
    const auth$ = this.YoutubeService.isAuthInit$;
    if (auth$) {
      auth$.subscribe((res: any) => {
        this.authCheck = res;
      });
    }
  }

  AuthUser() {
    if (this.authCheck == true && this.userProfile) return;
    const user$ = this.YoutubeService.user$;

    user$.subscribe((permission: any) => {
      this.userPermission = permission.Tc.scope.split(' ');
      this.YoutubePermission = this.CheckYoutubePermission(this.userPermission);
    });
  }

  AuthenticateUserProfile() {
    const Profile$ = this.YoutubeService.profile$;
    Profile$.subscribe((res: any) => {
      console.log(res, ' this is res');
      this.userProfile = res;
      this.AuthUser();
    });
  }

  CheckYoutubePermission(userScope: string[] | null): boolean {
    if (userScope === null) return false;
    const UserYoutubePermisson = userScope.includes(YoutubeUrls.YoutubeUrl);
    const UseryoutubeUploadPermission = userScope.includes(
      YoutubeUrls.YoutubeUploadUrl
    );

    if (UserYoutubePermisson && UseryoutubeUploadPermission) {
      return true;
    }
    return false;
  }

  signIn() {
    this.YoutubeService.signIn();
  }

  cancel() {
    this.subscription.unsubscribe();
    this.loading = false;
  }

  public upload() {
    this.loading = true;

    this.YoutubeService.UploadVideo(this.data, this.videoForm.value).subscribe(
      (data: any) => {
        if (data.type === HttpEventType.UploadProgress) {
          this.percentageUpload = Math.round((100 * data.loaded) / data.total);
        } else if (data instanceof HttpResponse) {
          const response: any = data.body;
          this.videoUrl = `https://www.youtube.com/watch?v=${response.id}`;
          this.loading = false;
          this.dialogRef.close(this.videoUrl);
          this.alertService.success(' The Video Has SuccessFully Uploaded ');
        }
      }
    ),
      (error: any) => {
        this.loading = false;
        this.CatchError(error);
      };
  }

  CatchError(error: any) {
    if (error instanceof Error) {
      this.alertService.message(error.message);
      throw new Error(error.message);
    } else {
      const errorObject = JSON.parse(error.error);
      if (errorObject.error.errors[0].reason == 'YoutubeSignupReequired') {
        this.alertService.message(
          'Please Create Your Account First On Youtube'
        );
      }
    }
  }
}

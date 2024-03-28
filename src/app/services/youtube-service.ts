/// <reference path ="../../../node_modules/@types/gapi.auth2/index.d.ts"/>
/// <reference path ="../../../node_modules/@types/gapi/index.d.ts"/>
import { Injectable, NgZone } from '@angular/core';
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;
import BasicProfile = gapi.auth2.BasicProfile;
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AlertService } from './alert-service';

interface videoInputTags {
  title: string;
  description: string;
  PrivacyStatus: string;
  Tags: string[];
}

@Injectable({ providedIn: 'any' })
export class YoutubeService {
  private Auth: GoogleAuth | null = null;
  public user$ = new BehaviorSubject<any>(null);
  private isSigned$ = new BehaviorSubject<any>(false);
  public isAuthInit$ = new BehaviorSubject<any>(false);
  public profile$: any = new BehaviorSubject<BasicProfile | null>(null);
  private accessToken: string | null = null;
  UserPermission: string[] | [] = [];
  private CLIENT_ID = process.env['AUTH_CLIENT_KEY'];
  private discoveryDocs = process.env['DISCOVERY_DOCS'];
  private SCOPE =
    'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube';
  private New_UPlOAD_URL =
    'https://youtube.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status,contentDetails';

  constructor(private HttpClient: HttpClient, private zone: NgZone) {
    gapi.load('auth2', () => {
      this.zone.run(() => {
        this.initAuth();
      });
    });

    this.profile$ = this.user$.pipe(
      map((user: any) =>
        user && user.getBasicProfile() ? user.getBasicProfile() : null
      )
    );

    this.user$.subscribe((user) => {
      if (user) {
        this.accessToken = user.getAuthResponse().access_token;
      }
    });
  }

  public initAuth() {
    const params = {
      client_id: this.CLIENT_ID,
      discoveryDocs: [this.discoveryDocs],
      scope: this.SCOPE,
      plugin_name: 'App Name that you used in google developer console API',
    };

    const auth = gapi.auth2.init(params);
    auth
      .then((authenticate: any) => {
        this.zone.run(() => {
          this.Auth = auth;
          this.isAuthInit$.next(true); 
        });
      })
      .catch((error: any) => {
        console.log(error, ' new Error ');
      });

    auth.currentUser.listen((user: GoogleUser) =>
      this.zone.run(() => {
        console.log(user, ' New User Came ');
        this.user$.next(user);
      })
    );

    auth.isSignedIn.listen((value) =>
      this.zone.run(() => {
        console.log(value, ' New Value ');
        if (!value) {
          this.user$.next(null);
        }
        this.isSigned$.next(value);
      })
    );

    if (auth.isSignedIn.get() === true) {
      auth.signIn();
    }

    this.zone.run(() => {
      this.user$.next(auth.isSignedIn.get());
    });
  }

  public signIn() {
    this.Auth?.signIn({ prompt: 'select_account' });
  }

  UploadVideo(video: File, input: videoInputTags) {
    const data = this.setData(input);
    if (!this.accessToken) {
      throw new Error('Token Does Not Exist');
    }
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.accessToken)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('X-Upload-Content-Length', video.size.toString())
      .set('X-Upload-Content-Type', 'video/*');

    return this.HttpClient.post(this.New_UPlOAD_URL as string, data, {
      headers,
      observe: 'response',
      responseType: 'text',
    }).pipe(
      switchMap((videoData: any) => {
        const httpRequest = new HttpRequest(
          'PUT',
          videoData.headers.get('location'),
          video,
          {
            reportProgress: true,
          }
        );
        return this.HttpClient.request(httpRequest);
      })
    );
  }

  setData(input: videoInputTags) {
    const data = {
      snippet: {
        title: input.title,
        description: input.description,
        tags: ['public', 'private '],
        categoryId: 22,
      },
      status: {
        privacyStatus: input.PrivacyStatus,
      },
      embeddable: true,
    };
    return data;
  }

  signOut() {
    this.Auth?.signOut();
  }
}

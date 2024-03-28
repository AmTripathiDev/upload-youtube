import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private snackbar: MatSnackBar) {}
  public success(message: string, duration: number = 2500) {
    return this.snackbar.open(message, ' ', {
      duration,
      panelClass: ['alert', 'alert-success'],
    });
  }

  public decline(message: string, duration: number = 2500) {
    return this.snackbar.open(message, ' ', {
      duration,
      panelClass: ['alert', 'alert-decline'],
    });
  }

  public message(message: string, duration: number = 2500) {
    return this.snackbar.open(message, ' ', {
      duration,
      panelClass: ['alert', 'alert-msg'],
    });
  }
}

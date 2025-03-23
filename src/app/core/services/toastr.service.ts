import { Injectable } from '@angular/core';
import { ToastrService as NgxToastr } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  constructor(private toastr: NgxToastr) {}

  showSuccess(message: string, title: string) {
    this.toastr.success(message, title);
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(message, title);
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string) {
    this.toastr.info(message, title);
  }
}

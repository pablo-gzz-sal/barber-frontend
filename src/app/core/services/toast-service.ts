import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

    constructor(private messageService: MessageService) {}

  success(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  error(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 4000
    });
  }

  warn(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life: 3000
    });
  }

  info(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life: 3000
    });
  }

  custom(config: any) {
    this.messageService.add(config);
  }

  clear() {
    this.messageService.clear();
  }
  
}

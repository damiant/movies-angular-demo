import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollTop = signal(0);
  private lastCall = 0;
  private pending: any = null;

  setScrollTop(value: number): void {
    const now = Date.now();
    if (now - this.lastCall >= 200) {
      this.scrollTop.set(value);
      this.lastCall = now;
    } else {
      if (this.pending !== null) {
        clearTimeout(this.pending);
      }
      this.pending = setTimeout(() => {
        this.scrollTop.set(value);
        this.lastCall = Date.now();
        this.pending = null;
      }, 200 - (now - this.lastCall));
    }
  }
}

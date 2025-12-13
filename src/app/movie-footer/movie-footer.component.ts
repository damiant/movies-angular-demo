import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-movie-footer',
  templateUrl: './movie-footer.component.html',
  styleUrls: ['./movie-footer.component.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFooterComponent {
  currentSegment = 'movies';

  constructor(private router: Router) {
    const currentUrl = this.router.url.split('/')[1];
    if (currentUrl === 'favorites') {
      this.currentSegment = 'favorites';
    } else {
      this.currentSegment = 'movies';
    }
  }

  onSegmentChange(event: any): void {
    const value = event.detail.value;
    if (value === 'movies') {
      this.router.navigate(['/movies']);
      this.currentSegment = 'movies';
    } else if (value === 'favorites') {
      this.router.navigate(['/favorites']);
      this.currentSegment = 'favorites';
    }
  }
}

import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';

import { Router } from '@angular/router';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { ScrollService } from '../services/scroll.service';

@Component({
  selector: 'app-movie-footer',
  templateUrl: './movie-footer.component.html',
  styleUrls: ['./movie-footer.component.scss'],
  standalone: true,
  imports: [
    IonSegment,
    IonSegmentButton,
    IonLabel
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFooterComponent {
  currentSegment = 'movies';
  favoritesCount = signal(0);
  isBouncing = signal(false);
  isHidden = signal(false);
  private lastScrollPosition = 0;
  private scrollThreshold = 50;

  constructor(
    private router: Router,
    private movieService: MovieService,
    private scrollService: ScrollService
  ) {
    const currentUrl = this.router.url.split('/')[1];
    if (currentUrl === 'favorites') {
      this.currentSegment = 'favorites';
    } else {
      this.currentSegment = 'movies';
    }

    // Update favorites count whenever movies or saved movies change
    effect(() => {
      const allMovies = this.movieService.getMovies();
      const saved = this.movieService.getSavedMovies(allMovies);
      const newCount = saved.length;
      
      // Trigger bounce animation if count changed
      if (newCount !== this.favoritesCount()) {
        this.isBouncing.set(true);
        this.favoritesCount.set(newCount);
        
        // Reset animation after it completes (800ms for 2 bounces)
        setTimeout(() => {
          this.isBouncing.set(false);
        }, 800);
      }
    });

    // Listen to scroll events from the scroll service
    effect(() => {
      const currentScrollPosition = this.scrollService.scrollTop();
      if (currentScrollPosition > this.lastScrollPosition + this.scrollThreshold) {
        // Scrolling down
        this.isHidden.set(true);
      } else if (currentScrollPosition < this.lastScrollPosition - this.scrollThreshold) {
        // Scrolling up
        this.isHidden.set(false);
      }
      
      this.lastScrollPosition = currentScrollPosition;
    });
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

import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';

import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonImg,
  IonBadge,
  IonIcon,
} from '@ionic/angular/standalone';
import { MovieService, Movie } from '../services/movie.service';
import { ScrollService } from '../services/scroll.service';
import { star } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PageSpacingComponent } from '../components/page-spacing/page-spacing.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonImg,
    IonBadge,
    IonIcon,
    PageSpacingComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage {
  savedMovies = signal<Movie[]>([]);
  star = star;
  selectedMovieId = signal<number | null>(null);

  constructor(private movieService: MovieService, private router: Router, private scrollService: ScrollService) {
    addIcons({ star });
    this.loadSavedMovies();

    // Reactively update saved movies whenever the movie list or saved status changes
    effect(() => {
      const allMovies = this.movieService.getMovies();
      this.savedMovies.set(this.movieService.getSavedMovies(allMovies));
    });
  }

  private loadSavedMovies(): void {
    const allMovies = this.movieService.getMovies();
    this.savedMovies.set(this.movieService.getSavedMovies(allMovies));
  }

  goToMovieDetails(movie: Movie): void {
    this.selectedMovieId.set(movie.id);
    this.movieService.setSelectedMovie(movie);
    this.router.navigate(['/movie-details'], {
      state: { movie, fromFavorites: true },
    });
  }

  openMovieLink(link: string, event: Event): void {
    event.stopPropagation();
    window.open(link, '_blank');
  }

  onScroll(event: any): void {
    this.scrollService.setScrollTop(event.detail.scrollTop);
  }
}

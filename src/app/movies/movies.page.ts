import {
  Component,
  signal,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { MovieService, Movie } from '../services/movie.service';
import { ScrollService } from '../services/scroll.service';
import { addIcons } from 'ionicons';
import { MovieCardLargeComponent } from '../components/movie-card-large/movie-card-large.component';
import { PageSpacingComponent } from '../components/page-spacing/page-spacing.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonSearchbar,
    MovieCardLargeComponent,
    PageSpacingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage {
  currentMovie = this.movieService.currentMovie;
  isLoading = this.movieService.getIsLoaded();
  randomMovies = signal<Movie[]>([]);
  searchQuery = signal('');
  searchResults = signal<Movie[] | null>(null);
  searching = signal(false);

  constructor(
    private movieService: MovieService,
    private router: Router,
    private scrollService: ScrollService
  ) {
    addIcons({});
    effect(() => {
      const isLoaded = this.isLoading();
      if (isLoaded) {
        this.loadRandomMovies();
      }
    });

    effect(() => {
      const query = this.searchQuery();
      if (query.trim() === '') {
        this.searchResults.set(null);
        this.searching.set(false);
        return;
      }
      this.searching.set(true);
      this.movieService.searchMovies(query).then((results) => {
        this.searchResults.set(results);
        this.searching.set(false);
      });
    });
  }

  private loadRandomMovies(): void {
    const allMovies = this.movieService.getMovies();
    const shuffled = [...allMovies].sort(() => Math.random() - 0.5);
    this.randomMovies.set(shuffled.slice(0, 5));
    this.isLoading.set(false);

  }

  openMovieLink(): void {
    const movie = this.currentMovie();
    if (movie?.link) {
      window.open(movie.link, '_blank');
    }
  }

  onReset(): void {
    this.movieService.resetMovies();
  }

  onActorClick(actorId: number): void {
    event?.stopPropagation();
    this.goToActorMovies(actorId);
  }

  goToActorMovies(actorId: number): void {
    this.router.navigate(['/actor', actorId]);
  }

  goToMovieDetails(movie: any): void {
    this.movieService.setSelectedMovie(movie);
    this.router.navigate(['/movie-details']);
  }

  toggleFavorite(movieId: number): void {
    this.movieService.toggleSaveForLater(movieId);
  }

  isFavorited(movieId: number): boolean {
    return this.movieService.isSavedForLater(movieId);
  }

  onScroll(event: any): void {
    this.scrollService.setScrollTop(event.detail.scrollTop);
  }
}

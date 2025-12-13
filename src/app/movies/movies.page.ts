import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonMenuButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
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
    IonMenuButton,
    IonButtons,
    MovieCardLargeComponent,
    PageSpacingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage {
  currentMovie = this.movieService.currentMovie;
  isLoading = signal(false);
  randomMovies = signal<any[]>([]);

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({});
    this.isLoading.set(true);
    setTimeout(() => {
      this.loadRandomMovies();
      this.isLoading.set(false);
    }, 500);
  }

  private loadRandomMovies(): void {
    const allMovies = this.movieService.getMovies();
    const shuffled = [...allMovies].sort(() => Math.random() - 0.5);
    this.randomMovies.set(shuffled.slice(0, 5));
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
}

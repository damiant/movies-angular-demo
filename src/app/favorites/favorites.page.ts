import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonButton,
  IonImg,
  IonBadge,
  IonMenuButton,
  IonButtons,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { MovieService, Movie } from '../services/movie.service';
import { star } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MovieFooterComponent } from '../movie-footer/movie-footer.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonImg,
    IonBadge,
    IonMenuButton,
    IonButtons,
    IonIcon,
    IonSpinner,
    MovieFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage {
  savedMovies = signal<Movie[]>([]);
  star = star;
  selectedMovieId = signal<number | null>(null);

  constructor(private movieService: MovieService, private router: Router) {
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
      state: { movie },
    });
  }

  openMovieLink(link: string, event: Event): void {
    event.stopPropagation();
    window.open(link, '_blank');
  }
}

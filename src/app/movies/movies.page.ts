import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
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
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner,
  IonFooter,
  IonButtons,
} from '@ionic/angular/standalone';
import { MovieService, Movie } from '../services/movie.service';
import {
  thumbsUpOutline,
  thumbsDownOutline,
  eyeOffOutline,
  bookmarkOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

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
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonImg,
    IonBadge,
    IonLabel,
    IonIcon,
    IonSpinner,
    IonFooter,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage {
  currentMovie = this.movieService.currentMovie;
  isLoading = signal(false);
  thumbsUpOutline = thumbsUpOutline;
  thumbsDownOutline = thumbsDownOutline;
  eyeOffOutline = eyeOffOutline;
  bookmarkOutline = bookmarkOutline;

  activePulse: string | null = null;
  floatingTexts: Array<{ id: number; text: string }> = [];
  private floatingTextId = 0;

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({
      thumbsUpOutline,
      thumbsDownOutline,
      eyeOffOutline,
      bookmarkOutline,
    });
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 500);
  }

  onThumbsUp(): void {
    const movie = this.currentMovie();
    if (movie) {
      this.animateButton('thumbsUp', 'Thumbs Up');
      this.movieService.rateMovie(movie.id, 'thumbsUp');
    }
  }

  onThumbsDown(): void {
    const movie = this.currentMovie();
    if (movie) {
      this.animateButton('thumbsDown', 'Thumbs Down');
      this.movieService.rateMovie(movie.id, 'thumbsDown');
    }
  }

  onDidntSee(): void {
    const movie = this.currentMovie();
    if (movie) {
      this.animateButton('didntSee', "Haven't Seen");
      this.movieService.markAsDidntSee(movie.id);
    }
  }

  onAddToList(): void {
    const movie = this.currentMovie();
    if (movie) {
      this.animateButton('addToList', 'Saved for Later');
      this.movieService.addToList(movie.id);
    }
  }

  private animateButton(buttonId: string, text: string): void {
    // Pulse animation
    this.activePulse = buttonId;
    setTimeout(() => {
      this.activePulse = null;
    }, 600);

    // Floating text animation
    const floatingId = this.floatingTextId++;
    this.floatingTexts.push({ id: floatingId, text });
    setTimeout(() => {
      this.floatingTexts = this.floatingTexts.filter((t) => t.id !== floatingId);
    }, 1500);
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

  trackByFloatingText(
    _index: number,
    item: { id: number; text: string }
  ): number {
    return item.id;
  }

  goToActorMovies(actorId: number): void {
    this.router.navigate(['/actor', actorId]);
  }
}

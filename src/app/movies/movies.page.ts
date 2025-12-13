import { Component, OnInit } from '@angular/core';
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
    IonButtons,
  ],
})
export class MoviesPage implements OnInit {
  currentMovie: Movie | null = null;
  movies: Movie[] = [];
  isLoading = true;
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
  }

  ngOnInit() {
    this.movieService.getCurrentMovie().subscribe((movie) => {
      this.currentMovie = movie;
      this.isLoading = false;
    });
  }

  onThumbsUp(): void {
    if (this.currentMovie) {
      this.animateButton('thumbsUp', 'Thumbs Up');
      this.movieService.rateMovie(this.currentMovie.id, 'thumbsUp');
    }
  }

  onThumbsDown(): void {
    if (this.currentMovie) {
      this.animateButton('thumbsDown', 'Thumbs Down');
      this.movieService.rateMovie(this.currentMovie.id, 'thumbsDown');
    }
  }

  onDidntSee(): void {
    if (this.currentMovie) {
      this.animateButton('didntSee', "Haven't Seen");
      this.movieService.markAsDidntSee(this.currentMovie.id);
    }
  }

  onAddToList(): void {
    if (this.currentMovie) {
      this.animateButton('addToList', 'Saved for Later');
      this.movieService.addToList(this.currentMovie.id);
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
    if (this.currentMovie?.link) {
      window.open(this.currentMovie.link, '_blank');
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

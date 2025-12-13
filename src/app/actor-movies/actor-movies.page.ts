import { Component, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  IonSpinner,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { MovieService, Movie, Actor } from '../services/movie.service';
import { starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ActorLargeComponent } from '../components/actor-large/actor-large.component';

@Component({
  selector: 'app-actor-movies',
  templateUrl: './actor-movies.page.html',
  styleUrls: ['./actor-movies.page.scss'],
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
    IonSpinner,
    IonBackButton,
    IonButtons,
    ActorLargeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActorMoviesPage {
  actor = signal<Actor | null>(null);
  movies = signal<Movie[]>([]);
  isLoading = signal(true);
  actorId: number | null = null;
  starOutline = starOutline;
  selectedMovieId = signal<number | null>(null);

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ starOutline });
    this.initializeActorData();
  }

  private initializeActorData(): void {
    effect(async () => {
      const params = this.route.snapshot.params;
      const id = params['id'];
      if (id) {
        this.actorId = id;
        await this.loadActorData();
      }
    });
  }

  private async loadActorData(): Promise<void> {
    if (!this.actorId) return;

    try {
      const actor = await this.movieService.getActor(this.actorId);
      this.actor.set(actor);

      const actorMovies = await this.movieService.getActorMovies(this.actorId);
      this.movies.set(actorMovies);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }

  openMovieLink(link: string): void {
    window.open(link, '_blank');
  }

  goToMovieDetails(movie: Movie): void {
    this.selectedMovieId.set(movie.id);
    this.movieService.setSelectedMovie(movie);
    this.router.navigate(['/movie-details'], {
      state: { movie },
    });
  }
}

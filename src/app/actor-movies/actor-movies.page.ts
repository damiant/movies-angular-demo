import { Component, OnInit } from '@angular/core';
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
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { MovieService, Movie, Actor } from '../services/movie.service';
import { starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

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
  ],
})
export class ActorMoviesPage implements OnInit {
  actor: Actor | null = null;
  movies: Movie[] = [];
  isLoading = true;
  actorId: number | null = null;
  starOutline = starOutline;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ starOutline });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.actorId = params['id'];
      if (this.actorId) {
        this.loadActorData();
      }
    });
  }

  private loadActorData(): void {
    if (!this.actorId) return;

    this.movieService.getActor(this.actorId).subscribe((actor) => {
      this.actor = actor;
    });

    this.movieService.getActorMovies(this.actorId).subscribe((movies) => {
      this.movies = movies;
      this.isLoading = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }

  openMovieLink(link: string): void {
    window.open(link, '_blank');
  }

  goToMovieDetails(movie: Movie): void {
    this.movieService.setSelectedMovie(movie);
    this.router.navigate(['/movie-details'], {
      state: { movie },
    });
  }
}

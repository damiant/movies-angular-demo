import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  image: string;
  description: string;
  actors: string[];
  actorImages: string[];
  actorIds: number[];
  year: number;
  rating: number; // 0-10
  link: string;
}

export interface Actor {
  id: number;
  name: string;
  profileImage: string;
}

export interface UserMovieRating {
  movieId: number;
  rating: 'thumbsUp' | 'thumbsDown' | 'didntSee' | null;
  addedToList: boolean;
}

interface TMDbMovie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface TMDbCredits {
  cast: Array<{ id: number; name: string; profile_path: string | null }>;
}


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly API_KEY = '47b9a9b5aea7b85e093e203b33d41878';
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  private currentMovieIndex = 0;
  private movies: Movie[] = [];
  private userRatings: Map<number, UserMovieRating> = new Map();
  private currentMovie$ = new BehaviorSubject<Movie | null>(null);
  private userMoviesList$ = new BehaviorSubject<Movie[]>([]);
  private isLoaded = false;

  constructor(private http: HttpClient) {
    this.loadMovies();
  }

  private loadMovies(): void {
    // Fetch popular movies from TMDB
    this.http
      .get<{ results: TMDbMovie[] }>(
        `${this.BASE_URL}/movie/popular?api_key=${this.API_KEY}&language=en-US&page=1`
      )
      .subscribe({
        next: (response) => {
          this.processMovies(response.results);
        },
        error: (error) => {
          console.error('Error loading movies from TMDB:', error);
          this.loadFallbackMovies();
        },
      });
  }

  private processMovies(tmdbMovies: TMDbMovie[]): void {
    const moviePromises = tmdbMovies.slice(0, 20).map((tmdbMovie) =>
      this.enrichMovieWithCredits(tmdbMovie)
        .pipe(
          catchError(() =>
            of(this.createMovieFromTMDb(tmdbMovie, [], []))
          )
        )
        .toPromise()
    );

    Promise.all(moviePromises).then((enrichedMovies) => {
      this.movies = enrichedMovies.filter(
        (movie): movie is Movie => movie !== null
      );
      this.initializeRatings();
      this.currentMovie$.next(this.movies[0] || null);
      this.isLoaded = true;
    });
  }

  private enrichMovieWithCredits(tmdbMovie: TMDbMovie): Observable<Movie> {
    return this.http
      .get<TMDbCredits>(
        `${this.BASE_URL}/movie/${tmdbMovie.id}/credits?api_key=${this.API_KEY}`
      )
      .pipe(
        map((credits) => {
          const topCast = credits.cast.slice(0, 3);
          const actors = topCast.map((actor) => actor.name);
          const actorIds = topCast.map((actor) => actor.id);
          const actorImages = topCast.map((actor) =>
            actor.profile_path
              ? `${this.IMAGE_BASE_URL}${actor.profile_path}`
              : 'https://via.placeholder.com/150x150?text=No+Image'
          );
          return this.createMovieFromTMDb(tmdbMovie, actors, actorImages, actorIds);
        })
      );
  }

  private createMovieFromTMDb(tmdbMovie: TMDbMovie, actors: string[], actorImages: string[], actorIds: number[] = []): Movie {
    const year = new Date(tmdbMovie.release_date).getFullYear();
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      image: tmdbMovie.poster_path
        ? `${this.IMAGE_BASE_URL}${tmdbMovie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image',
      description: tmdbMovie.overview || 'No description available',
      actors: actors.length > 0 ? actors : ['Unknown'],
      actorImages: actorImages.length > 0 ? actorImages : [],
      actorIds: actorIds.length > 0 ? actorIds : [],
      year: year || new Date().getFullYear(),
      rating: tmdbMovie.vote_average,
      link: `https://www.themoviedb.org/movie/${tmdbMovie.id}`,
    };
  }

  private loadFallbackMovies(): void {
    // Fallback to sample movies if API fails
    const fallbackMovies: Movie[] = [
      {
        id: 278,
        title: 'The Shawshank Redemption',
        image: 'https://image.tmdb.org/t/p/w500/q6725aieQkBBKOQsggvHWYcgISJ.jpg',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        actors: ['Tim Robbins', 'Morgan Freeman'],
        actorImages: [],
        actorIds: [],
        year: 1994,
        rating: 9.3,
        link: 'https://www.themoviedb.org/movie/278',
      },
      {
        id: 238,
        title: 'The Godfather',
        image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fmnbZ1.jpg',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.',
        actors: ['Marlon Brando', 'Al Pacino', 'James Caan'],
        actorImages: [],
        actorIds: [],
        year: 1972,
        rating: 9.2,
        link: 'https://www.themoviedb.org/movie/238',
      },
      {
        id: 155,
        title: 'The Dark Knight',
        image: 'https://image.tmdb.org/t/p/w500/1hqwGsggBV2JLicCrWZbnezRSclu.jpg',
        description: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests to fight injustice.',
        actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
        actorImages: [],
        actorIds: [],
        year: 2008,
        rating: 9.0,
        link: 'https://www.themoviedb.org/movie/155',
      },
    ];

    this.movies = fallbackMovies;
    this.initializeRatings();
    this.currentMovie$.next(this.movies[0] || null);
    this.isLoaded = true;
  }

  private initializeRatings(): void {
    this.movies.forEach((movie) => {
      this.userRatings.set(movie.id, {
        movieId: movie.id,
        rating: null,
        addedToList: false,
      });
    });
  }

  getCurrentMovie(): Observable<Movie | null> {
    return this.currentMovie$.asObservable();
  }

  getUserMoviesList(): Observable<Movie[]> {
    return this.userMoviesList$.asObservable();
  }

  rateMovie(movieId: number, rating: 'thumbsUp' | 'thumbsDown'): void {
    const userRating = this.userRatings.get(movieId);
    if (userRating) {
      userRating.rating = rating;
    }
    this.nextMovie();
  }

  markAsDidntSee(movieId: number): void {
    const userRating = this.userRatings.get(movieId);
    if (userRating) {
      userRating.rating = 'didntSee';
    }
    this.nextMovie();
  }

  addToList(movieId: number): void {
    const userRating = this.userRatings.get(movieId);
    if (userRating) {
      userRating.addedToList = true;
      const movie = this.movies.find((m) => m.id === movieId);
      if (movie) {
        const currentList = this.userMoviesList$.value;
        if (!currentList.find((m) => m.id === movieId)) {
          this.userMoviesList$.next([...currentList, movie]);
        }
      }
    }
  }

  nextMovie(): void {
    this.currentMovieIndex++;
    if (this.currentMovieIndex < this.movies.length) {
      this.currentMovie$.next(this.movies[this.currentMovieIndex]);
    } else {
      this.currentMovie$.next(null);
    }
  }

  resetMovies(): void {
    this.currentMovieIndex = 0;
    this.userRatings.clear();
    this.userMoviesList$.next([]);
    this.initializeRatings();
    this.currentMovie$.next(this.movies[0] || null);
  }

  getUserRatings(): Map<number, UserMovieRating> {
    return this.userRatings;
  }

  getActorMovies(actorId: number): Observable<Movie[]> {
    return this.http
      .get<{
        cast: Array<{
          id: number;
          title: string;
          poster_path: string;
          overview: string;
          release_date: string;
          vote_average: number;
        }>;
      }>(
        `${this.BASE_URL}/person/${actorId}/movie_credits?api_key=${this.API_KEY}`
      )
      .pipe(
        map((response) => {
          return response.cast
            .filter((movie) => movie.poster_path)
            .slice(0, 10)
            .map((tmdbMovie) => this.createMovieFromTMDb(tmdbMovie as TMDbMovie, [], [], []));
        }),
        catchError(() => of([]))
      );
  }

  getActor(actorId: number): Observable<Actor | null> {
    return this.http
      .get<{ id: number; name: string; profile_path: string | null }>(
        `${this.BASE_URL}/person/${actorId}?api_key=${this.API_KEY}`
      )
      .pipe(
        map((response) => ({
          id: response.id,
          name: response.name,
          profileImage: response.profile_path
            ? `${this.IMAGE_BASE_URL}${response.profile_path}`
            : 'https://via.placeholder.com/300x450?text=No+Image',
        })),
        catchError(() => of(null))
      );
  }

  setSelectedMovie(movie: Movie): void {
    this.currentMovie$.next(movie);
  }

  getSelectedMovie(): Observable<Movie | null> {
    return this.currentMovie$.asObservable();
  }
}

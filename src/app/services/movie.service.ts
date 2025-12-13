import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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

  private movies = signal<Movie[]>([]);
  private currentMovieIndex = signal(0);
  private userRatings = signal<Map<number, UserMovieRating>>(new Map());
  private isLoaded = signal(false);
  private userMoviesList = signal<Movie[]>([]);

  currentMovie = computed(() => {
    const movies = this.movies();
    const index = this.currentMovieIndex();
    return index < movies.length ? movies[index] : null;
  });

  constructor(private http: HttpClient) {
    this.loadMovies();
  }

  private async loadMovies(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.get<{ results: TMDbMovie[] }>(
          `${this.BASE_URL}/movie/popular?api_key=${this.API_KEY}&language=en-US&page=1`
        )
      );
      await this.processMovies(response.results);
    } catch (error) {
      console.error('Error loading movies from TMDB:', error);
      this.loadFallbackMovies();
    }
  }

  private async processMovies(tmdbMovies: TMDbMovie[]): Promise<void> {
    const moviePromises = tmdbMovies.slice(0, 20).map((tmdbMovie) =>
      this.enrichMovieWithCredits(tmdbMovie)
    );

    try {
      const enrichedMovies = await Promise.all(moviePromises);
      this.movies.set(enrichedMovies.filter((movie): movie is Movie => movie !== null));
      this.initializeRatings();
      this.isLoaded.set(true);
    } catch (error) {
      console.error('Error processing movies:', error);
      this.loadFallbackMovies();
    }
  }

  private async enrichMovieWithCredits(tmdbMovie: TMDbMovie): Promise<Movie> {
    try {
      const credits = await lastValueFrom(
        this.http.get<TMDbCredits>(
          `${this.BASE_URL}/movie/${tmdbMovie.id}/credits?api_key=${this.API_KEY}`
        )
      );
      const topCast = credits.cast.slice(0, 3);
      const actors = topCast.map((actor) => actor.name);
      const actorIds = topCast.map((actor) => actor.id);
      const actorImages = topCast.map((actor) =>
        actor.profile_path
          ? `${this.IMAGE_BASE_URL}${actor.profile_path}`
          : 'https://via.placeholder.com/150x150?text=No+Image'
      );
      return this.createMovieFromTMDb(tmdbMovie, actors, actorImages, actorIds);
    } catch {
      return this.createMovieFromTMDb(tmdbMovie, [], [], []);
    }
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

    this.movies.set(fallbackMovies);
    this.initializeRatings();
    this.isLoaded.set(true);
  }

  private initializeRatings(): void {
    const ratingsMap = new Map<number, UserMovieRating>();
    this.movies().forEach((movie) => {
      ratingsMap.set(movie.id, {
        movieId: movie.id,
        rating: null,
        addedToList: false,
      });
    });
    this.userRatings.set(ratingsMap);
  }

  rateMovie(movieId: number, rating: 'thumbsUp' | 'thumbsDown'): void {
    const ratingsMap = this.userRatings();
    const userRating = ratingsMap.get(movieId);
    if (userRating) {
      userRating.rating = rating;
    }
    this.nextMovie();
  }

  markAsDidntSee(movieId: number): void {
    const ratingsMap = this.userRatings();
    const userRating = ratingsMap.get(movieId);
    if (userRating) {
      userRating.rating = 'didntSee';
    }
    this.nextMovie();
  }

  addToList(movieId: number): void {
    const ratingsMap = this.userRatings();
    const userRating = ratingsMap.get(movieId);
    if (userRating) {
      userRating.addedToList = true;
      const movie = this.movies().find((m) => m.id === movieId);
      if (movie) {
        const currentList = this.userMoviesList();
        if (!currentList.find((m) => m.id === movieId)) {
          this.userMoviesList.set([...currentList, movie]);
        }
      }
    }
  }

  nextMovie(): void {
    const nextIndex = this.currentMovieIndex() + 1;
    this.currentMovieIndex.set(nextIndex);
  }

  resetMovies(): void {
    this.currentMovieIndex.set(0);
    this.userRatings.set(new Map());
    this.userMoviesList.set([]);
    this.initializeRatings();
  }

  getUserRatings(): Map<number, UserMovieRating> {
    return this.userRatings();
  }

  getUserMoviesList() {
    return this.userMoviesList;
  }

  async getActorMovies(actorId: number): Promise<Movie[]> {
    try {
      const response = await lastValueFrom(
        this.http.get<{
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
      );
      return response.cast
        .filter((movie) => movie.poster_path)
        .slice(0, 10)
        .map((tmdbMovie) => this.createMovieFromTMDb(tmdbMovie as TMDbMovie, [], [], []));
    } catch {
      return [];
    }
  }

  async getActor(actorId: number): Promise<Actor | null> {
    try {
      const response = await lastValueFrom(
        this.http.get<{ id: number; name: string; profile_path: string | null }>(
          `${this.BASE_URL}/person/${actorId}?api_key=${this.API_KEY}`
        )
      );
      return {
        id: response.id,
        name: response.name,
        profileImage: response.profile_path
          ? `${this.IMAGE_BASE_URL}${response.profile_path}`
          : 'https://via.placeholder.com/300x450?text=No+Image',
      };
    } catch {
      return null;
    }
  }

  setSelectedMovie(movie: Movie): void {
    // Store selected movie for navigation
    this.selectedMovie.set(movie);
  }

  private selectedMovie = signal<Movie | null>(null);

  getSelectedMovie() {
    return this.selectedMovie;
  }
}

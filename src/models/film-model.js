export class FilmModel {
  constructor(filmData) {
    this.id = filmData.id;
    this.title = filmData.film_info.title;
    this.originalTitile = filmData.film_info.alternative_title;
    this.rating = filmData.film_info.total_rating;
    this.duration = filmData.film_info.runtime;
    this.genres = filmData.film_info.genre;
    this.posterSrc = filmData.film_info.poster;
    this.description = filmData.film_info.description;
    this.comments = filmData.comments;
    this.age = filmData.film_info.age_rating;
    this.director = filmData.film_info.director;
    this.writers = filmData.film_info.writers;
    this.actors = filmData.film_info.actors;
    this.releaseDate = new Date(filmData.film_info.release.date);
    this.country = filmData.film_info.release.release_country;
    this.isInWatchlist = filmData.user_details.watchlist;
    this.isFavorite = filmData.user_details.favorite;
    this.isHistory = filmData.user_details.already_watched;
    this.watchingDate = new Date(filmData.user_details.watching_date);
  }

  static parseFilm(filmData) {
    return new FilmModel(filmData);
  }

  static parseFilms(filmData) {
    return filmData.map(FilmModel.parseFilm);
  }

  static clone(filmData) {
    return new FilmModel(filmData.toRaw());
  }

  toRaw() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitile,
        "total_rating": this.rating,
        "poster": this.posterSrc,
        "age_rating": this.age,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate.toISOString(),
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.isInWatchlist,
        "already_watched": this.isHistory,
        "watching_date": this.watchingDate.toISOString(),
        "favorite": this.isFavorite
      }
    };
  }
}

export class FilmModel {
  constructor(data) {
    this.id = data.id;
    this.title = data.film_info.title;
    this.originalTitile = data.film_info.alternative_title;
    this.rating = data.film_info.total_rating;
    this.year = new Date(data.film_info.release.date).getFullYear();
    this.duration = data.film_info.runtime;
    this.genres = data.film_info.genre;
    this.posterSrc = data.film_info.poster;
    this.description = data.film_info.description;
    this.comments = data.comments;
    this.age = data.film_info.age_rating;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.releaseDate = new Date(data.film_info.release.date);
    this.country = data.film_info.release.release_country;
    this.isInWatchlist = data.user_details.watchlist;
    this.isFavorite = data.user_details.favorite;
    this.isHistory = data.user_details.already_watched;
    this.watchingDate = new Date(data.user_details.watching_date);
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  static clone(data) {
    return new FilmModel(data.toRaw());
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

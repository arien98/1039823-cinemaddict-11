export class FilmModel {
  constructor(incomedata) {
    this.id = incomedata.id;
    this.title = incomedata.film_info.title;
    this.originalTitile = incomedata.film_info.alternative_title;
    this.rating = incomedata.film_info.total_rating;
    this.year = new Date(incomedata.film_info.release.date).getFullYear();
    this.duration = incomedata.film_info.runtime;
    this.genres = incomedata.film_info.genre;
    this.posterSrc = incomedata.film_info.poster;
    this.description = incomedata.film_info.description;
    this.comments = incomedata.comments;
    this.age = incomedata.film_info.age_rating;
    this.director = incomedata.film_info.director;
    this.writers = incomedata.film_info.writers;
    this.actors = incomedata.film_info.actors;
    this.releaseDate = new Date(incomedata.film_info.release.date);
    this.country = incomedata.film_info.release.release_country;
    this.isInWatchlist = incomedata.user_details.watchlist;
    this.isFavorite = incomedata.user_details.favorite;
    this.isHistory = incomedata.user_details.already_watched;
    this.watchingDate = new Date(incomedata.user_details.watching_date);
  }

  static parseFilm(incomedata) {
    return new FilmModel(incomedata);
  }

  static parseFilms(incomedata) {
    return incomedata.map(FilmModel.parseFilm);
  }

  static clone(incomedata) {
    return new FilmModel(incomedata.toRaw());
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

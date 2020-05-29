export class FilmModel {
  constructor(data) {
    this.id = data.id;
    this.title = data.film_info.title;
    this.originalTitile = data.film_info.alternative_title;
    this.rating = data.film_info.total_rating;
    this.year = data.film_info.release.date;
    this.duration = data.film_info.runtime;
    this.genres = data.film_info.genre;
    this.posterSrc = data.film_info.poster;
    this.description = data.film_info.description;
    this.comments = data.comments;
    this.age = data.film_info.age_rating;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.releaseDate = data.film_info.release.date;
    this.country = data.film_info.release.release_country;
    this.isInWatchlist = Boolean(data.user_details.watchlist);
    this.isFavorite = Boolean(data.user_details.favorite);
    this.isHistory = Boolean(data.user_details.already_watched);
    this.watchingDate = data.user_details.watching_date;
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }
}

import {FilterType} from "../constants.js";
import {getFilmsByFilter} from "../utils/filter.js";
import {getUniqueItems} from "../utils/common.js";

export class FilmsModel {
  constructor() {
    this._films = [];
    this._dataChangeHandlers = [];
    this._activeFilterType = FilterType.ALL;
    this._filterChangeHandlers = [];
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  removeFilm(id) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addFilm(film) {
    this._films = [].concat(film, this._films);
    this._callHandlers(this._dataChangeHandlers);
  }

  getWatchedFilms() {
    return this._films.filter((film) => film.isHistory);
  }

  getGenreSelectedFilms() {
    let genres = [];
    this._films.forEach((film) => {
      (film.genres.forEach((genre) => genres.push(genre)));
    });
    genres = getUniqueItems(genres);
    const watchedFilms = this.getWatchedFilms();
    const genresCount = genres.map((genre) => {
      return {
        genre,
        count: watchedFilms.filter((film) => film.genres.includes(genre)).length
      };
    });
    return genresCount.sort((a, b) => {
      return b.count - a.count;
    });
  }
}

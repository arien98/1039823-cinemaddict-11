import {FilterType} from "../constants.js";
import {getFilmsByFilter} from "../utils/filter.js";
import {getUniqueItems} from "../utils/common.js";
import moment from "moment";
import {StatFilter} from "../components/statistics-component.js";

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

  getTopRatedFilms() {
    return this._films.slice().sort((a, b) => {
      return b.rating - a.rating;
    });
  }

  getMostCommentedFilms() {
    return this._films.slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    });
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

  addFilm(film) {
    this._films = [].concat(film, this._films);
    this._callHandlers(this._dataChangeHandlers);
  }

  getWatchedFilms(filter) {
    const watchedFilms = this._films.slice().filter((film) => film.isHistory);
    let filteredFilms = [];
    switch (filter) {
      case StatFilter.ALL:
        filteredFilms = watchedFilms;
        break;
      case StatFilter.TODAY:
        filteredFilms = watchedFilms.filter((it) => {
          const a = moment(it.watchingDate);
          const b = moment().hours(0).minutes(0).seconds(0);
          return a.diff(b) > 0;
        });
        break;
      case StatFilter.WEEK:
        filteredFilms = watchedFilms.filter((it) => {
          const a = moment(it.watchingDate);
          const b = moment().subtract(7, `day`);
          return a.diff(b) > 0;
        });
        break;
      case StatFilter.MONTH:
        filteredFilms = watchedFilms.filter((it) => {
          const a = moment(it.watchingDate);
          const b = moment().subtract(1, `month`);
          return a.diff(b) > 0;
        });
        break;
      case StatFilter.YEAR:
        filteredFilms = watchedFilms.filter((it) => {
          const a = moment(it.watchingDate);
          const b = moment().subtract(1, `year`);
          return a.diff(b) > 0;
        });
        break;
    }
    return filteredFilms;
  }

  getGenreSelectedFilms(filter) {
    let genres = [];
    this._films.forEach((film) => {
      (film.genres.forEach((genre) => genres.push(genre)));
    });
    genres = getUniqueItems(genres);
    const watchedFilms = this.getWatchedFilms(filter);
    const genresCount = genres.map((genre) => {
      return {
        genre,
        count: watchedFilms.filter((film) => film.genres.includes(genre)).length
      };
    })
      .filter((it) => it.count > 0);
    return genresCount.sort((a, b) => {
      return b.count - a.count;
    });
  }
}

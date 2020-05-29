import {FilterType} from "../constants.js";
import {getFilmsByFilter} from "../utils/filter.js";
import {getUniqueItems} from "../utils/common.js";
import moment from "moment";

const StatFilter = {
  ALL: `All time`,
  TODAY: `today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`
};

const DaysIn = {
  DAY: 1,
  WEEK: 7,
  MONTH: 31,
  YEAR: 365
}

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
    let watchedFilms = this._films.slice().filter((film) => film.isHistory);
    switch (filter) {
      case StatFilter.ALL:
        break;
      case StatFilter.TODAY:
        watchedFilms.filter((it) => moment(it.releaseDate).get(`date`) < moment().subtract(1, `day`).get(`date`));
        break;
      case StatFilter.WEEK:
        watchedFilms.filter((it) => moment(it.releaseDate).get(`date`) < moment().subtract(7, `day`).get(`date`));
        break;
      case StatFilter.MONTH:
        watchedFilms.filter((it) => moment(it.releaseDate).get(`date`) < moment().subtract(1, `month`).get(`date`));
        break;
      case StatFilter.YEAR:
        watchedFilms.filter((it) => moment(it.releaseDate).get(`second`) < moment().subtract(1, `year`).get(`second`));
        break;
    }
    return watchedFilms;
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
    });
    return genresCount.sort((a, b) => {
      return b.count - a.count;
    });
  }
}

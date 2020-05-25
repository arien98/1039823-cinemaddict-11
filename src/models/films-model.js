import {FilterType} from "../constants.js";
import {getFilmsByFilter} from "../utils/filter.js";

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
}

import {FilterType} from "../constants.js";

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isInHistory);
};

export const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getArchiveTasks(films);
    case FilterType.HISTORY:
      return getFavoriteFilms(films);
    case FilterType.FAVORITES:
      return getFavoriteFilms(films);
  }
};

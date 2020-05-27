import {FilterType} from "../constants.js";

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return films.filter((film) => film.isInWatchlist);
    case FilterType.HISTORY:
      return films.filter((film) => film.isHistory);
    case FilterType.FAVORITES:
      return films.filter((film) => film.isFavorite);
  }
  return films;
};

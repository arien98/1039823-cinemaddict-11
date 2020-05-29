import {AbstractComponent} from "./abstract-component.js";
import moment from "moment";

export class FilmCardComponent extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return this._createFilmCardTemplate();
  }

  setClickHandler(handler) {
    this.getElement()
      .querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
      .forEach((element) => {
        element.addEventListener(`click`, handler);
      });
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }

  _createFilmCardTemplate() {
    const {title, rating, year, duration, genres, posterSrc, description, comments,
      isInWatchlist, isHistory, isFavorite} = this._film;
    const watchlistActive = isInWatchlist ? `film-card__controls-item--active` : ``;
    const watchedActive = isHistory ? `film-card__controls-item--active` : ``;
    const favoriteActive = isFavorite ? `film-card__controls-item--active` : ``;
    const genreTemplate = genres ? genres[0] : ``;
    const commentsCount = comments ? comments.length : `0`;
    const yearTemplate = moment(year).format(`YYYY`);
    const durationTemplate = `${Math.floor(duration / 60)}h ${duration % 60}m`;

    return (
      `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${yearTemplate}</span>
          <span class="film-card__duration">${durationTemplate}</span>
          <span class="film-card__genre">${genreTemplate}</span>
        </p>
        <img src=${posterSrc} alt="Постер к фильму ${title}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${commentsCount} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item ${watchlistActive} button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
          <button class="film-card__controls-item ${watchedActive} button film-card__controls-item--mark-as-watched">Mark as watched</button>
          <button class="film-card__controls-item ${favoriteActive} button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
      </article>`);
  }
}

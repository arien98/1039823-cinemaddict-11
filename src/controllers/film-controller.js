import {FilmDetailsComponent} from "../components/film-details-component.js";
import {renderElement, remove} from "../utils/render.js";
import {FilmCardComponent} from "../components/film-card-component.js";
import {CommentsModel} from "../models/comments-model.js";

export const emptyFilm = {};

export class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._filmClickHandler = this._filmClickHandler.bind(this);
    this._closeDetailsButtonHandler = this._closeDetailsButtonHandler.bind(this);
    this._escPressHandler = this._escPressHandler.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._film = null;
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._commentsModel = new CommentsModel();
  }

  render(film) {
    this._film = film;
    this._filmComponent = new FilmCardComponent(this._film);
    this._commentsModel = new CommentsModel(this._film);
    this._commentsModel.setComments(this._film.comments);
    this._filmDetailsComponent = new FilmDetailsComponent(this._film, this._commentsModel);

    renderElement(this._container, this._filmComponent);

    this._filmComponent.setClickHandler(this._filmClickHandler);

    this._filmComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
    });

    this._filmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isHistor: !this._film.isHistory}));
    });

    this._filmComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
    });
  }

  _filmClickHandler() {
    this._onViewChange();

    renderElement(document.body, this._filmDetailsComponent);

    this._filmDetailsComponent.setEmojiClickHandler(this._filmDetailsComponent.emojiClickHandler);

    if (this._film.comments.length > 0) {
      this._filmDetailsComponent.setDeleteClickHandler(this._filmDetailsComponent.deleteClickHandler);
    }

    this._filmDetailsComponent.setCloseButtonHandler(this._closeDetailsButtonHandler);
    this._filmDetailsComponent.setEscButtonHandler(this._escPressHandler);

    this._filmDetailsComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
    });
    this._filmDetailsComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isHistor: !this._film.isHistory}));
    });
    this._filmDetailsComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
    });
    this._filmDetailsComponent.setInputChangeHandler(this._filmDetailsComponent.inputChangeHandler);
  }

  _closeDetailsButtonHandler() {
    remove(this._filmDetailsComponent);
  }

  _escPressHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closeDetailsButtonHandler();
    }
  }

  setDefaultView() {
    this._closeDetailsButtonHandler();
  }

  destroy() {
    remove(this._filmDetailsComponent);
    remove(this._filmComponent);
    document.removeEventListener(`keydown`, this._escPressHandler);
  }
}

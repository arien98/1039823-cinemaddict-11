import {FilmDetailsComponent} from "../components/film-details-component.js";
import {renderElement, remove, replace} from "../utils/render.js";
import {FilmCardComponent} from "../components/film-card-component.js";
import {CommentsModel} from "../models/comments-model.js";

export const emptyFilm = {};

export class FilmController {
  constructor(container, onDataChange, onViewChange, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filmClickHandler = this._filmClickHandler.bind(this);
    this._closeDetailsButtonHandler = this._closeDetailsButtonHandler.bind(this);
    this._escPressHandler = this._escPressHandler.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._film = null;
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._inputChangeHandler = this._inputChangeHandler.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
  }

  render(film) {
    this._film = film;
    this._commentsModel = new CommentsModel(this._film);
    this._commentsModel.setComments(this._film.comments);
    this._filmDetailsComponent = new FilmDetailsComponent(this._film, this._commentsModel);

    let oldComponent = this._filmComponent;

    this._filmComponent = new FilmCardComponent(this._film);

    if (oldComponent) {
      replace(this._filmComponent, oldComponent);
    } else {
      renderElement(this._container, this._filmComponent);
    }

    oldComponent = null;

    this._setFilmHandlers();
  }

  _setFilmHandlers() {
    this._filmComponent.setClickHandler(this._filmClickHandler);

    this._filmComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
    });

    this._filmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isHistory: !this._film.isHistory}));
    });

    this._filmComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
    });
  }

  _filmClickHandler() {
    this._onViewChange();

    renderElement(document.body, this._filmDetailsComponent);

    this._setPopupHandlers();
  }

  _setPopupHandlers() {
    this._filmDetailsComponent.setEmojiClickHandler(this._filmDetailsComponent.emojiClickHandler);


    this._filmDetailsComponent.setCloseButtonHandler(this._closeDetailsButtonHandler);
    this._filmDetailsComponent.setEscButtonHandler(this._escPressHandler);

    this._filmDetailsComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
    });
    this._filmDetailsComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isHistory: !this._film.isHistory}));
    });
    this._filmDetailsComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
    });
    this._filmDetailsComponent.setInputChangeHandler(this._inputChangeHandler);

    if (this._film.comments.length > 0) {
      this._filmDetailsComponent.setDeleteClickHandler(this._deleteClickHandler);
    }
  }

  _closeDetailsButtonHandler() {
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent.removeEscButtonHandler(this._escPressHandler);
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

  _inputChangeHandler(evt) {
    if (evt.key === `Enter`) {
      const newComment = this._filmDetailsComponent.createNewComment(evt.target.value);
      this._onCommentsChange(null, newComment);
    }
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;
    const oldComment = this._commentsModel.getComments().find((comment) => comment.id === commentId);
    this._onCommentsChange(oldComment, null);
  }

  _onCommentsChange(oldComment, newComment) {
    if (newComment === null) {
      const commentId = oldComment.id;
      this._commentsModel.removeComment(commentId, this._film);
    } else {
      if (oldComment === null) {
        this._commentsModel.addComment(newComment);
      } else {
        return;
      }
    }
    this._onDataChange(this, this._film, Object.assign({}, this._film, {comments: this._commentsModel.getComments()}));
    this._filmDetailsComponent.setScrollTop(this._filmDetailsComponent.getElement().scrollTop);
    this._filmDetailsComponent.rerender();
  }
}

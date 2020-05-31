import {FilmDetailsComponent} from "../components/film-details-component.js";
import {renderElement, remove, replace} from "../utils/render.js";
import {FilmCardComponent} from "../components/film-card-component.js";
import {CommentsModel} from "../models/comments-model.js";
import {FilmModel} from "../models/film-model.js";
import {CommentModel} from "../models/comment-model.js";

export const emptyFilm = {};
const SHAKE_ANIMATION_TIMEOUT = 600;

export class FilmController {
  constructor(container, onDataChange, onViewChange, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;
    this._openPopup = this._openPopup.bind(this);
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


    let oldFilmComponent = this._filmComponent;
    let oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardComponent(this._film);
    this._filmDetailsComponent = new FilmDetailsComponent(this._film, this._commentsModel);

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      renderElement(this._container, this._filmComponent);
    }

    oldFilmComponent = null;
    oldFilmDetailsComponent = null;

    this._setFilmHandlers();
  }

  _setFilmHandlers() {
    this._filmComponent.setClickHandler(this._openPopup);

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

  _openPopup() {
    this._onViewChange();

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);

        renderElement(document.body, this._filmDetailsComponent);

        this._setPopupHandlers();
      });
  }

  _setPopupHandlers() {
    this._filmDetailsComponent.setEmojiClickHandler(this._filmDetailsComponent.emojiClickHandler);


    this._filmDetailsComponent.setCloseButtonHandler(this._closeDetailsButtonHandler);
    this._filmDetailsComponent.setEscButtonHandler(this._escPressHandler);

    this._filmDetailsComponent.setWatchlistButtonClickHandler(() => {
      const newFilm = FilmModel.clone(this._film);
      newFilm.isInWatchlist = !this._film.isInWatchlist;
      this._onDataChange(this, this._film, newFilm);
    });
    this._filmDetailsComponent.setWatchedButtonClickHandler(() => {
      const newFilm = FilmModel.clone(this._film);
      newFilm.isHistory = !this._film.isHistory;
      this._onDataChange(this, this._film, newFilm);
    });
    this._filmDetailsComponent.setFavoriteButtonClickHandler(() => {
      const newFilm = FilmModel.clone(this._film);
      newFilm.isFavorite = !this._film.isFavorite;
      this._onDataChange(this, this._film, newFilm);
    });
    this._filmDetailsComponent.setInputChangeHandler(this._inputChangeHandler);

    if (this._film.comments.length > 0) {
      this._filmDetailsComponent.setDeleteClickHandler(this._deleteClickHandler);
    }
  }

  _closeDetailsButtonHandler() {
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent.removeEscButtonHandler(this._escPressHandler);
    this._filmDetailsComponent.clearNewComment();
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
    if (((evt.key === `Enter`) && (evt.ctrlKey)) || ((evt.key === `Enter`) && (evt.metaKey))) {
      const newComment = this._filmDetailsComponent.createNewComment(evt.target.value);
      this._onCommentsChange(null, newComment);
      this._filmDetailsComponent.setScrollTop(this._filmDetailsComponent.getElement().scrollTop);
    }
  }

  _deleteClickHandler(evt) {
    const commentId = evt.target.dataset.commentId;
    const oldComment = this._commentsModel.getComments().find((comment) => comment.id === commentId);
    this._onCommentsChange(oldComment, null);
  }

  _onCommentsChange(oldComment, newComment) {

    if (newComment === null) {
      this._filmDetailsComponent.blockDeleteButtons();
      const commentId = oldComment.id;
      this._api.deleteComment(commentId)
        .then(() => this._commentsModel.removeComment(commentId, this._film))
        .catch(() => {
          this._filmDetailsComponent.unblockDeleteButtons();
          this.shake();
        });
    } else {
      if (oldComment === null) {
        this._filmDetailsComponent.blockForm();
        const newCommentData = CommentModel.clone(newComment);
        this._api.createComment(this._film.id, newCommentData)
          .then(() => this._commentsModel.addComment(newComment))
          .catch(() => {
            this._filmDetailsComponent.unblockForm();
            this.shake();
            this._filmDetailsComponent.colorInput();
          });
      } else {
        return;
      }
    }

    const newFilm = FilmModel.clone(this._film);
    newFilm.comments = this._commentsModel.getComments();
    this._onDataChange(this, this._film, newFilm);

    this._filmDetailsComponent.setScrollTop(this._filmDetailsComponent.getElement().scrollTop);
    this._openPopup();
  }

  shake() {
    this._filmDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._filmComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

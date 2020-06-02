import {FilmDetailsComponent} from "../components/film-details-component.js";
import {renderElement, remove, replace} from "../utils/render.js";
import {FilmCardComponent} from "../components/film-card-component.js";
import {CommentsModel} from "../models/comments-model.js";
import {FilmModel} from "../models/film-model.js";
import {CommentModel} from "../models/comment-model.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

const UserProperty = {
  WATCHLIST: `isInWatchlist`,
  WATCHED: `isHistory`,
  FAVORITE: `isFavorite`
};

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
    this._filmDetailsNewCommentHandler = this._filmDetailsNewCommentHandler.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._userPropertiesClickHandler = this._userPropertiesClickHandler.bind(this);
    this._commentsModel = new CommentsModel(this._film);
    this._popupScrollTop = null;
  }

  render(film) {
    this._film = film;
    let oldFilmComponent = this._filmComponent;
    let oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardComponent(this._film);
    this._filmDetailsComponent = new FilmDetailsComponent(this._film, this._commentsModel);

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
      this._filmDetailsComponent.getElement().scrollTop = this._popupScrollTop;
      oldFilmDetailsComponent.removeEscButtonHandler(this._escPressHandler);
      this._setPopupHandlers();
    } else {
      renderElement(this._container, this._filmComponent);
    }

    oldFilmComponent = null;
    oldFilmDetailsComponent = null;

    this._setFilmHandlers();
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

  _onCommentsChange(oldComment, newComment) {
    switch (true) {
      case (newComment === null):
        const commentId = oldComment.id;
        this._filmDetailsComponent.blockDeleteButtons(commentId);
        this._api.deleteComment(commentId)
          .then(() => {
            this._commentsModel.removeComment(commentId, this._film);
            this._film.comments = this._commentsModel.getCommentsId();

            this._popupScrollTop = this._filmDetailsComponent.getElement().scrollTop;
            this.render(this._film);
          })
          .catch(() => {
            this._filmDetailsComponent.unblockDeleteButtons();
            this.shake();
          });
        break;
      case (oldComment === null):
        this._filmDetailsComponent.blockForm();
        const newCommentData = CommentModel.createNewComment(newComment);
        this._api.createComment(this._film.id, newCommentData)
          .then((response) => {
            const addedComment = response.newComments[response.newComments.length - 1];

            this._film.comments.push(String(addedComment.id));
            this._commentsModel.addComment(addedComment);

            const newFilm = response.newFilm;
            const isSuccess = this._filmsModel.updateFilm(this._film.id, newFilm);
            this._popupScrollTop = this._filmDetailsComponent.getElement().scrollTop;

            if (isSuccess) {
              this.render(newFilm);
            }
          })
          .catch(() => {
            this._filmDetailsComponent.unblockForm();
            this.shake();
            this._filmDetailsComponent.colorInput();
          });
        break;
      default:
        break;
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

  shake() {
    this._filmDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._filmComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._filmDetailsComponent.getElement().style.animation = ``;
      this._filmComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _setFilmHandlers() {
    this._filmComponent.setClickHandler(this._openPopup);
    this._filmComponent.setWatchlistButtonClickHandler(this._userPropertiesClickHandler(UserProperty.WATCHLIST));
    this._filmComponent.setWatchedButtonClickHandler(this._userPropertiesClickHandler(UserProperty.WATCHED));
    this._filmComponent.setFavoriteButtonClickHandler(this._userPropertiesClickHandler(UserProperty.FAVORITE));
  }

  _setPopupHandlers() {
    this._filmDetailsComponent.setEmojiClickHandler(this._filmDetailsComponent.emojiClickHandler);
    this._filmDetailsComponent.setEnterHandler(this._filmDetailsNewCommentHandler);

    this._filmDetailsComponent.setCloseButtonHandler(this._closeDetailsButtonHandler);
    this._filmDetailsComponent.setEscButtonHandler(this._escPressHandler);
    this._filmDetailsComponent.setWatchlistButtonClickHandler(this._userPropertiesClickHandler(UserProperty.WATCHLIST));
    this._filmDetailsComponent.setWatchedButtonClickHandler(this._userPropertiesClickHandler(UserProperty.WATCHED));
    this._filmDetailsComponent.setFavoriteButtonClickHandler(this._userPropertiesClickHandler(UserProperty.FAVORITE));

    if (this._commentsModel.getComments().length > 0) {
      this._filmDetailsComponent.setDeleteClickHandler((this._deleteClickHandler));
    }
  }

  _filmDetailsNewCommentHandler(newComment) {
    this._onCommentsChange(null, newComment);
    this._filmDetailsComponent.setScrollTop(this._filmDetailsComponent.getElement().scrollTop);
  }

  _deleteClickHandler(commentId) {
    const oldComment = this._commentsModel.getCommentById(commentId);
    this._filmDetailsComponent.blockDeleteButtons(commentId);
    this._onCommentsChange(oldComment, null);
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

  _userPropertiesClickHandler(property) {
    return (evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm[property] = !newFilm[property];
      this._popupScrollTop = this._filmDetailsComponent.getElement().scrollTop;
      this._onDataChange(this, this._film, newFilm);
    };
  }
}

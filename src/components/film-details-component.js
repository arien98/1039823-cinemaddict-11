import {CommentsComponent} from "./comments-component.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from "moment";
import {encode} from "he";

const emojisType = [`smile`, `sleeping`, `puke`, `angry`];

const createGenresTemplate = (genres) => {
  return genres
    .map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    })
    .join(`\n`);
};

const createEmojiMarkup = (emojis, newComment) => {
  return emojis.map((emoji) => {
    const isChecked = (newComment.emoji === emoji) ? `checked` : ``;

    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked}>
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji" data-emoji-type = ${emoji}>
      </label>`);
  })
    .join(`\n`);
};

const createFilmDetailsTemplate = (film, commentsTemplate, newComment) => {
  const {
    title, originalTitile, rating, duration, genres, posterSrc, description,
    age, director, writers, actors, releaseDate, country, comments, isInWatchlist, isHistory, isFavorite
  } = film;
  const genresMarkup = createGenresTemplate(genres);
  const commentsMarkup = commentsTemplate;
  const releaseDateMarkup = moment(releaseDate).format(`MMMM Do YYYY`);

  const emojisMarkup = createEmojiMarkup(emojisType, newComment);
  const selectedEmoji = newComment.emoji ? `<img src="./images/emoji/${newComment.emoji}.png" width="30" height="30" alt="emoji" data-emoji-type = ${newComment.emoji}></img>` : ``;

  const watchlistActive = isInWatchlist ? `checked` : ``;
  const watchedActive = isHistory ? `checked` : ``;
  const favoriteActive = isFavorite ? `checked` : ``;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${posterSrc}" alt="">

              <p class="film-details__age">${age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${originalTitile}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateMarkup}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                  ${genresMarkup}
                </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistActive}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedActive}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteActive}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${selectedEmoji}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojisMarkup}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`);
};

export class FilmDetailsComponent extends AbstractSmartComponent {
  constructor(film, commentsModel) {
    super();
    this._film = film;
    this._commentsModel = commentsModel;
    this._commentsComponent = new CommentsComponent(this._commentsModel);
    this._watchlistClickHandler = null;
    this._historyClickHandler = null;
    this._favoriteClickHandler = null;
    this._closeButtonClickHandler = null;
    this._escClickHandler = null;
    this._newComment = {};
    this.emojiClickHandler = this.emojiClickHandler.bind(this);
  }

  getTemplate() {
    const commentsTemplate = this._commentsComponent.getTemplate();
    return createFilmDetailsTemplate(this._film, commentsTemplate, this._newComment);
  }

  setCloseButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeButtonClickHandler = handler;
  }

  setEscButtonHandler(handler) {
    document.addEventListener(`keydown`, handler);
    this._escClickHandler = handler;
  }

  removeEscButtonHandler(handler) {
    document.removeEventListener(`keydown`, handler);
    this._escClickHandler = handler;
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
    this._watchlistClickHandler = handler;
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
    this._historyClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
    this._favoriteClickHandler = handler;
  }

  setEmojiClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, handler);
  }

  emojiClickHandler(evt) {
    if (evt.target.tagName === `IMG`) {
      const emoji = evt.target.dataset.emojiType;
      this._newComment = {emoji};
      this._scrollTop = this.getElement().scrollTop;
      this.rerender();
    } else {
      return;
    }
  }

  setInputChangeHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, handler);
    this._inputChangeHandler = handler;
  }

  setDeleteClickHandler(handler) {
    const realHandler = (evt) => {
      const commentId = evt.target.dataset.commentId;
      handler(commentId);
    };
    this.getElement()
      .querySelector(`.film-details__comment-delete`)
      .addEventListener(`click`, realHandler);
    this._deleteClickHandler = realHandler;
  }

  recoveryListeners() {
    this.setCloseButtonHandler(this._closeButtonClickHandler);
    this.setEscButtonHandler(this._escClickHandler);
    this.setWatchlistButtonClickHandler(this._watchlistClickHandler);
    this.setWatchedButtonClickHandler(this._historyClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteClickHandler);
    this.setEmojiClickHandler(this.emojiClickHandler);
    this.setInputChangeHandler(this._inputChangeHandler);
    if (this._film.comments.length > 0) {
      this.setDeleteClickHandler(this._deleteClickHandler);
    }
  }

  rerender() {
    super.rerender();
    this.getElement().scrollTop = this._scrollTop;
  }

  createNewComment(newCommentText) {
    const newComment = Object.assign({}, this._newComment, {
      id: String(Math.random()),
      text: encode(newCommentText),
      author: null,
      day: new Date()
    });
    this._newComment = {};
    return newComment;
  }

  setScrollTop(scrollTop) {
    this._scrollTop = scrollTop;
  }

  clearNewComment() {
    this._newComment = {};
  }
}

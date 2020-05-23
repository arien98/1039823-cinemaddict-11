import {CommentsComponent} from "./comments-component.js";
import AbstractSmartComponent from "./abstract-smart-component.js";

const createGenresTemplate = (genres) => {
  return genres
    .map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    })
    .join(`\n`);
};

const createFilmDetailsTemplate = (film) => {
  const {
    title, originalTitile, rating, duration, genres, posterSrc,
    description, age, director, writers, actors, releaseDate, country, comments
  } = film;
  const genresMarkup = createGenresTemplate(genres);
  const commentsMarkup = new CommentsComponent(comments).getTemplate();

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
                  <td class="film-details__cell">${releaseDate}</td>
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
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
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
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`);
};

export class FilmDetailsComponent extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._watchlistClickHandler = null;
    this._historyClickHandler = null;
    this._favoriteClickHandler = null;
    this._closeButtonClickHandler = null;
    this._escClickHandler = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  setCloseButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeButtonClickHandler = handler;
  }

  removeCloseButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);
  }

  setEscButtonHandler(handler) {
    document.addEventListener(`keydown`, handler);
    this._escClickHandler = handler;
  }

  removeEscButtonHandler(handler) {
    document.removeEventListener(`keydown`, handler);
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
    this._emojiClickHandler = handler;
  }

  setEmoji(emoji) {
    const container = this.getElement().querySelector(`.film-details__add-emoji-label`);
    while (container.firstChild) {
      container.firstChild.remove();
    }
    container.append(emoji);
  }

  recoveryListeners() {
    this.setCloseButtonHandler(this._closeButtonClickHandler);
    this.setEscButtonHandler(this._escClickHandler);
    this.setWatchlistButtonClickHandler(this._watchlistClickHandler);
    this.setWatchedButtonClickHandler(this._historyClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteClickHandler);
    this.setEmojiClickHandler(this._emojiClickHandler);
  }

  reset() {
    // const film = this._film;
    // film.
  }
}

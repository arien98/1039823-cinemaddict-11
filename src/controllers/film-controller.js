import {FilmDetailsComponent} from "../components/film-details-component.js";
import {renderElement, remove} from "../utils/render.js";
import {FilmCardComponent} from "../components/film-card-component.js";

export class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._filmClickHandler = this._filmClickHandler.bind(this);
    this._closeDetailsButtonHandler = this._closeDetailsButtonHandler.bind(this);
    this._escPressHandler = this._escPressHandler.bind(this);
    this._onDataChange = onDataChange;
    this._EmojiClickHandler = this._emojiClickHandler.bind(this);
    this._onViewChange = onViewChange;
    this._film = null;
    this._filmDetails = null;
  }

  render(film) {
    this._film = film;
    this._filmComponent = new FilmCardComponent(this._film);
    this._filmDetails = new FilmDetailsComponent(this._film);

    renderElement(this._container, this._filmComponent);

    this._filmComponent.setClickHandler(this._filmClickHandler(this._film));

    this._filmComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
    });

    this._filmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isHistor: !this._film.isHistor}));
    });

    this._filmComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._film, Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
    });
  }

  _filmClickHandler(film) {
    return () => {
      this._onViewChange();

      renderElement(document.body, this._filmDetails);

      this._filmDetails.setCloseButtonHandler(this._closeDetailsButtonHandler);
      this._filmDetails.setEscButtonHandler(this._escPressHandler);
      this._filmDetails.setEmojiClickHandler(this._emojiClickHandler);

      this._filmDetails.setWatchlistButtonClickHandler(() => {
        this._onDataChange(this, film, Object.assign({}, film, {isInWatchlist: !film.isInWatchlist}));
      });
      this._filmDetails.setWatchedButtonClickHandler(() => {
        this._onDataChange(this, film, Object.assign({}, film, {isHistor: !film.isHistor}));
      });
      this._filmDetails.setFavoriteButtonClickHandler(() => {
        this._onDataChange(this, film, Object.assign({}, film, {isFavorite: !film.isFavorite}));
      });
    };
  }

  _closeDetailsButtonHandler() {
    remove(this._filmDetails);
    this._filmDetails.removeCloseButtonHandler(this._closeDetailsButtonHandler);
    this._filmDetails.removeEscButtonHandler(this._escPressHandler);
  }

  _escPressHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closeDetailsButtonHandler();
    }
  }

  _emojiClickHandler(evt) {
    const emoji = evt.target.datasetEmojiType;
    this._filmDetails.setEmoji(emoji);
  }

  setDefaultView() {
    this._closeDetailsButtonHandler();
  }
}

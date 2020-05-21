import {FilmCardComponent} from "../components/film-card-component.js";
import {FilmDetailsComponent} from "../components/film-details-component.js";
import {renderElement, remove} from "../utils/render.js";
import {PageController} from "./page-controller.js";

export class FilmController {
  constructor(film) {
    this._film = new FilmCardComponent(film);
    this._filmDetails = new FilmDetailsComponent(film);
    this._filmClickHandler = this._filmClickHandler.bind(this);
    this._closeDetailsButtonHandler = this._closeDetailsButtonHandler.bind(this);
    this._escPressHandler = this._escPressHandler.bind(this);
  }

  render(container) {
    renderElement(container, this._film);

    this._film.setClickHandler(this._filmClickHandler);
    this._film.setWatchlistButtonClickHandler(PageController.onDataChange);
    this._film.setWatchedButtonClickHandler(PageController.onDataChange);
    this._film.setFavoriteButtonClickHandler(PageController.onDataChange);
  }

  _filmClickHandler() {
    renderElement(document.body, this._filmDetails);
    this._filmDetails.setCloseButtonHandler(this._closeDetailsButtonHandler);
    document.addEventListener(`keydown`, this._escPressHandler);
  }

  _closeDetailsButtonHandler() {
    remove(this._filmDetails);
    this._filmDetails.removeCloseButtonHandler(this._closeDetailsButtonHandler);
    document.removeEventListener(`keydown`, this._escPressHandler);
  }

  _escPressHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closeDetailsButtonHandler();
    }
  }
}

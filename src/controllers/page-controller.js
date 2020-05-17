import {FilmCardComponent} from "../components/film-card-component.js";
import {ShowButtonComponent} from "../components/show-button-component.js";
import {FilmDetailsComponent} from "../components/film-details-component.js";
import {NoFilmsComponents} from "../components/no-films-component.js";
import {renderElement, RenderPosition, remove} from "../utils/render.js";

const FILMS_NUMBER_ON_START = 5;
const FILMS_NUMBER_ON_BUTTON_CLICK = 5;
const TOTAL_FILMS_NUMBER = 20;

const renderFilms = (start, end, container, films) => {
  films
    .slice(start, end)
    .forEach((film) => {
      renderFilm(film, container);
    });
};

const renderFilm = (film, place) => {
  const siteMain = document.querySelector(`.main`);
  const filmComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const filmClickHandler = () => {
    renderElement(siteMain, filmDetailsComponent);
    filmDetailsComponent.setCloseButtonHandler(closeDetailsButtonHandler);
    document.addEventListener(`keydown`, escPressHandler);
  };

  const closeDetailsButtonHandler = () => {
    remove(filmDetailsComponent);
    filmDetailsComponent.removeCloseButtonHandler(closeDetailsButtonHandler);
    document.removeEventListener(`keydown`, escPressHandler);
  };

  const escPressHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeDetailsButtonHandler();
    }
  };

  filmComponent.setClickHandler(filmClickHandler);

  renderElement(place, filmComponent);
};

export class PageController {
  constructor(container) {
    this._container = container;
    this._showButton = new ShowButtonComponent();
    this._noFilms = new NoFilmsComponents();
  }

  render(filmsData) {
    if (TOTAL_FILMS_NUMBER === 0) {
      renderElement(this._container, this._noFilms);
    } else {
      renderFilms(0, FILMS_NUMBER_ON_START, this._container, filmsData);
      renderElement(this._container, this._showButton, RenderPosition.AFTER);
    }

    let filmsOnPageNumber = FILMS_NUMBER_ON_START;

    const showButtonClickHandler = () => {
      let prevFilmsNumber = filmsOnPageNumber;
      filmsOnPageNumber += FILMS_NUMBER_ON_BUTTON_CLICK;

      renderFilms(prevFilmsNumber, filmsOnPageNumber, this._container, filmsData);

      if (filmsOnPageNumber >= TOTAL_FILMS_NUMBER) {
        remove(this._showButton);
        this._showButton.removeClickHandler(showButtonClickHandler);
      }
    };

    this._showButton.setClickHandler(showButtonClickHandler);
  }
}

import {FilmCardComponent} from "../components/film-card-component.js";
import {ShowButtonComponent} from "../components/show-button-component.js";
import {FilmDetailsComponent} from "../components/film-details-component.js";
import {NoFilmsComponents} from "../components/no-films-component.js";
import {renderElement, RenderPosition, remove} from "../utils/render.js";
import {SortingComponent, SortType} from "../components/sorting-component.js";
import {FilmsContainerComponent} from "../components/films-container-component.js";

const TOTAL_FILMS_NUMBER = 20;
const FILMS_NUMBER_ON_START = 5;
const FILMS_NUMBER_ON_BUTTON_CLICK = 5;
const TOP_RATED_FILMS_NUMBER = 2;
const MOST_COMMENTED_FILMS_NUMBER = 2;

const renderFilms = (start, end, container, films) => {
  films
    .slice(start, end)
    .forEach((film) => {
      renderFilm(film, container);
    });
};

const renderFilm = (film, place) => {
  const filmComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const filmClickHandler = () => {
    renderElement(document.body, filmDetailsComponent);
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

const getSortedFilms = (films, sortType) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.year - a.year);
      break;
  }

  return sortedFilms;
};

export class PageController {
  constructor(container) {
    this._container = container;
    this._showButton = new ShowButtonComponent();
    this._noFilms = new NoFilmsComponents();
    this._sorting = new SortingComponent();
    this._filmsContainer = new FilmsContainerComponent();
  }

  render(filmsData) {
    renderElement(this._container, this._filmsContainer);

    const filmsContainer = this._filmsContainer.getFilmsContainer();
    const topRatedFilmsContainer = this._filmsContainer.getTopRatedFilmsContainer();
    const mostCommentedFilmsContainer = this._filmsContainer.getTopMostCommentedContainer();

    if (TOTAL_FILMS_NUMBER === 0) {
      renderElement(filmsContainer, this._noFilms);
      return;
    }

    renderElement(filmsContainer, this._sorting, RenderPosition.BEFORE);

    const showButtonClickHandler = (films, filmsOnPageNumber) => () => {
      let prevFilmsNumber = filmsOnPageNumber;
      filmsOnPageNumber += FILMS_NUMBER_ON_BUTTON_CLICK;

      renderFilms(prevFilmsNumber, filmsOnPageNumber, filmsContainer, films);

      if (filmsOnPageNumber >= TOTAL_FILMS_NUMBER) {
        remove(this._showButton);
        this._showButton.removeClickHandler(showButtonClickHandler);
      }
    };

    const renderFilmDesk = (films) => {
      renderFilms(0, FILMS_NUMBER_ON_START, filmsContainer, films);
      renderElement(filmsContainer, this._showButton, RenderPosition.AFTER);

      let filmsOnPageNumber = FILMS_NUMBER_ON_START;

      this._showButton.setClickHandler(showButtonClickHandler(films, filmsOnPageNumber));
    };

    renderFilmDesk(filmsData);

    this._sorting.setSortTypeChengeHandler((sortType) => {
      this._showButton.removeClickHandler(showButtonClickHandler);
      filmsContainer.innerHTML = ``;

      renderFilmDesk(getSortedFilms(filmsData, sortType));
    });

    renderFilms(0, TOP_RATED_FILMS_NUMBER, topRatedFilmsContainer, filmsData);
    renderFilms(0, MOST_COMMENTED_FILMS_NUMBER, mostCommentedFilmsContainer, filmsData);
  }
}

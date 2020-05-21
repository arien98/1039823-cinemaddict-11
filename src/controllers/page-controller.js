import {ShowButtonComponent} from "../components/show-button-component.js";
import {NoFilmsComponents} from "../components/no-films-component.js";
import {renderElement, RenderPosition, remove} from "../utils/render.js";
import {SortingComponent, SortType} from "../components/sorting-component.js";
import {FilmsContainerComponent} from "../components/films-container-component.js";
import {FilmController} from "./film-controller.js";

const FilmsNumber = {
  TOTAL: 20,
  ON_START: 5,
  ON_BUTTON_CLICK: 5,
  TOP_RATED: 2,
  MOST_COMMENTED: 2
};

export class PageController {
  constructor(container) {
    this._container = container;
    this._showButton = new ShowButtonComponent();
    this._noFilms = new NoFilmsComponents();
    this._sorting = new SortingComponent();
    this._filmsContainer = new FilmsContainerComponent();
    this._totalFilmsCount = FilmsNumber.TOTAL;
    this._onStartFilmsCount = FilmsNumber.ON_START;
    this._onButtonClickFilmsCount = FilmsNumber.ON_BUTTON_CLICK;
    this._topRatedFilmsCount = FilmsNumber.TOP_RATED;
    this._mostCommentedFilmsCount = FilmsNumber.MOST_COMMENTED;
    this._filmsOnPageNumber = 0;
  }


  render(filmsData) {
    const filmsContainer = this._filmsContainer.getFilmsContainer();
    const topRatedFilmsContainer = this._filmsContainer.getTopRatedFilmsContainer();
    const mostCommentedFilmsContainer = this._filmsContainer.getTopMostCommentedContainer();

    renderElement(this._container, this._filmsContainer);

    if (this._totalFilmsCount === 0) {
      renderElement(filmsContainer, this._noFilms);
      return;
    }

    renderElement(filmsContainer, this._sorting, RenderPosition.BEFORE);

    this._renderFilmDesk(filmsData, filmsContainer);

    this._sorting.setSortTypeChengeHandler((sortType) => {
      remove(this._showButton);
      filmsContainer.innerHTML = ``;

      this._renderFilmDesk(this._getSortedFilms(filmsData, sortType), filmsContainer);
    });

    this._renderFilms(0, this._topRatedFilmsCount, topRatedFilmsContainer, filmsData);
    this._renderFilms(0, this._mostCommentedFilmsCount, mostCommentedFilmsContainer, filmsData);
  }

  _renderFilms(start, end, container, films) {
    films
      .slice(start, end)
      .forEach((film) => {
        const filmController = new FilmController(film);
        filmController.render(container);
      });
  }

  _renderFilmDesk(films, filmsContainer) {
    this._renderFilms(0, this._onStartFilmsCount, filmsContainer, films);
    renderElement(filmsContainer, this._showButton, RenderPosition.AFTER);

    this._filmsOnPageNumber = this._onStartFilmsCount;

    this._showButton.setClickHandler(this._showButtonClickHandler(films, filmsContainer));
  }

  _showButtonClickHandler(films, filmsContainer) {
    return () => {
      let prevFilmsNumber = this._filmsOnPageNumber;
      this._filmsOnPageNumber += this._onButtonClickFilmsCount;

      this._renderFilms(prevFilmsNumber, this._filmsOnPageNumber, filmsContainer, films);

      if (this._filmsOnPageNumber >= this._totalFilmsCount) {
        remove(this._showButton);
        this._showButton.removeClickHandler(this._showButtonClickHandler(films, filmsContainer));
      }
    };
  }


  _getSortedFilms(films, sortType) {
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
  }
}

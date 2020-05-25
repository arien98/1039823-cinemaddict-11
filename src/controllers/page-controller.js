import {ShowButtonComponent} from "../components/show-button-component.js";
import {NoFilmsComponents} from "../components/no-films-component.js";
import {renderElement, RenderPosition, remove} from "../utils/render.js";
import {SortingComponent, SortType} from "../components/sorting-component.js";
import {FilmsContainerComponent} from "../components/films-container-component.js";
import {FilmController} from "./film-controller.js";

export class PageController {
  constructor(container, filmsModel) {
    this._films = [];
    this._showedFilmControllers = [];
    this._container = container;
    this._showButton = new ShowButtonComponent();
    this._noFilms = new NoFilmsComponents();
    this._sorting = new SortingComponent();
    this._filmsContainer = new FilmsContainerComponent();
    this._onStartFilmsCount = 5;
    this._onButtonClickFilmsCount = 5;
    this._topRatedFilmsCount = 2;
    this._mostCommentedFilmsCount = 2;
    this._filmsOnPageNumber = 0;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._filmsModel = filmsModel;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }


  render() {
    this._films = this._filmsModel.getFilms();
    const filmsContainer = this._filmsContainer.getFilmsContainer();
    const topRatedFilmsContainer = this._filmsContainer.getTopRatedFilmsContainer();
    const mostCommentedFilmsContainer = this._filmsContainer.getTopMostCommentedContainer();

    renderElement(this._container, this._filmsContainer);

    if (this._films.length === 0) {
      renderElement(filmsContainer, this._noFilms);
      return;
    }

    renderElement(filmsContainer, this._sorting, RenderPosition.BEFORE);

    this._renderFilmDesk(this._films, filmsContainer);

    this._sorting.setSortTypeChangeHandler((sortType) => {
      remove(this._showButton);
      this._removeFilms();

      const sortedFilms = this._getSortedFilms(sortType);

      this._renderFilmDesk(sortedFilms, filmsContainer);
    });

    this._renderFilms(0, this._topRatedFilmsCount, topRatedFilmsContainer, this._films);
    this._renderFilms(0, this._mostCommentedFilmsCount, mostCommentedFilmsContainer, this._films);
  }

  _renderFilms(start, end, container, films) {
    return films
      .slice(start, end)
      .map((film) => {
        const filmController = new FilmController(container, this._onDataChange, this._onViewChange);
        filmController.render(film);
        return filmController;
      });
  }

  _renderFilmDesk(films, filmsContainer) {
    const newFilms = this._renderFilms(0, this._onStartFilmsCount, filmsContainer, films);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    renderElement(filmsContainer, this._showButton, RenderPosition.AFTER);

    this._filmsOnPageNumber = this._onStartFilmsCount;

    this._showButton.setClickHandler(this._showButtonClickHandler(films, filmsContainer));
  }

  _showButtonClickHandler(films, filmsContainer) {
    return () => {
      let prevFilmsNumber = this._filmsOnPageNumber;
      this._filmsOnPageNumber += this._onButtonClickFilmsCount;

      const newFilms = this._renderFilms(prevFilmsNumber, this._filmsOnPageNumber, filmsContainer, films);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._filmsOnPageNumber >= this._films.length) {
        remove(this._showButton);
        this._showButton.removeClickHandler(this._showButtonClickHandler(films, filmsContainer));
      }
    };
  }


  _getSortedFilms(sortType) {
    let sortedFilms = [];
    const showingFilms = this._films.slice();

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

  _onDataChange(filmController, oldData, newData) {
    const isSuccess = this._filmsModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      filmController.render(newData);
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onFilterChange() {
    this._updateFilms(this._onStartFilmsCount);
  }
}

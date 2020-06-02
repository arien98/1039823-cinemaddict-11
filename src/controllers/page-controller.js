import {ShowButtonComponent} from "../components/show-button-component.js";
import {NoFilmsComponents} from "../components/no-films-component.js";
import {renderElement, RenderPosition, remove} from "../utils/render.js";
import {SortingComponent, SortType} from "../components/sorting-component.js";
import {FilmsContainerComponent} from "../components/films-container-component.js";
import {FilmController} from "./film-controller.js";

export class PageController {
  constructor(container, filmsModel, api, loadingComponent) {
    this._films = [];
    this._showedFilmControllers = [];
    this._container = container;
    this._api = api;
    this._loadingComponent = loadingComponent;
    this._showButton = new ShowButtonComponent();
    this._noFilms = new NoFilmsComponents();
    this._sortComponent = new SortingComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
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
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    this._films = this._filmsModel.getFilms();
    this._topRatedFilms = this._filmsModel.getTopRatedFilms();
    this._mostCommentedFilms = this._filmsModel.getMostCommentedFilms();
    this._filmsContainer = this._filmsContainerComponent.getFilmsContainer();
    this._topRatedFilmsContainer = this._filmsContainerComponent.getTopRatedFilmsContainer();
    this._mostCommentedFilmsContainer = this._filmsContainerComponent.getTopMostCommentedContainer();

    renderElement(this._container, this._filmsContainerComponent);

    if (this._films.length === 0) {
      renderElement(this._filmsContainer, this._noFilms);
      return;
    }
    renderElement(this._filmsContainer, this._sortComponent, RenderPosition.BEFORE);

    this._renderFilmDesk(this._films, this._filmsContainer);

    this._renderExtraFilms();
  }

  _renderFilms(start, end, container, films) {
    return films
      .slice(start, end)
      .map((film) => {
        const filmController = new FilmController(container, this._onDataChange, this._onViewChange, this._filmsModel, this._api);
        filmController.render(film);
        return filmController;
      });
  }

  _renderFilmDesk(films, filmsContainer) {
    const newFilms = this._renderFilms(0, this._onStartFilmsCount, filmsContainer, films);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    if (films.length > this._onStartFilmsCount) {
      renderElement(filmsContainer, this._showButton, RenderPosition.AFTER);
      this._filmsOnPageNumber = this._onStartFilmsCount;
      this._showButton.setClickHandler(this._showButtonClickHandler(films, filmsContainer));
    }
  }

  _renderExtraFilms() {
    let newFilms = this._renderFilms(0, this._topRatedFilmsCount, this._topRatedFilmsContainer, this._topRatedFilms);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    newFilms = this._renderFilms(0, this._mostCommentedFilmsCount, this._mostCommentedFilmsContainer, this._mostCommentedFilms);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
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
        sortedFilms = showingFilms.sort((a, b) => b.releaseDate - a.releaseDate);
        break;
    }

    return sortedFilms;
  }

  _onSortTypeChange(sortType) {
    remove(this._sortComponent);

    renderElement(this._filmsContainer, this._sortComponent, RenderPosition.BEFORE);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._removeFilms();

    const sortedFilms = this._getSortedFilms(sortType);
    this._renderFilmDesk(sortedFilms, this._filmsContainer);
    this._renderExtraFilms();
  }

  _onDataChange(filmController, oldFilm, newFilm) {
    this._api.updateFilm(oldFilm.id, newFilm)
      .then((filmModel) => {

        const isSuccess = this._filmsModel.updateFilm(oldFilm.id, filmModel);

        if (isSuccess) {
          filmController.render(filmModel);
        }
      })
      .catch(() => {
        filmController.shake();
      });
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._sortComponent.setDefaultSortType();
    this._updateFilms();
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
    remove(this._showButton);
    remove(this._noFilms);
  }

  _updateFilms() {
    remove(this._sortComponent);

    this._removeFilms();
    this.render();

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  show() {
    this._filmsContainerComponent.show();
  }

  hide() {
    this._filmsContainerComponent.hide();
  }

  _showButtonClickHandler(films, filmsContainer) {
    return () => {
      const prevFilmsNumber = this._filmsOnPageNumber;
      this._filmsOnPageNumber += this._onButtonClickFilmsCount;

      const newFilms = this._renderFilms(prevFilmsNumber, this._filmsOnPageNumber, filmsContainer, films);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._filmsOnPageNumber >= this._films.length) {
        remove(this._showButton);
      }
    };
  }
}

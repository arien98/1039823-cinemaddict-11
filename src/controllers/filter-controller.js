import {FilterType} from "../constants.js";
import {FilterComponent} from "../components/filter-component.js";
import {renderElement, replace} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";

const StatShowMode = {
  ON: `on`,
  OFF: `off`
};

export class FilterController {
  constructor(container, filmsModel, statisticsComponent, pageController) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._statisticsComponent = statisticsComponent;
    this._pageController = pageController;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);

    this._StatButtonClickHandler = this._StatButtonClickHandler.bind(this);
    this._filterButtonsClickHandler = this._filterButtonsClickHandler.bind(this);

    this._statShowMode = StatShowMode.OFF;
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    let oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterClickHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      renderElement(container, this._filterComponent);
    }

    oldComponent = null;

    this._filterComponent.setStatButtonClickHandler(this._StatButtonClickHandler);
    this._filterComponent.setFilterClickHandler(this._filterButtonsClickHandler);
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }

  _StatButtonClickHandler() {
    this._pageController.hide();
    this._statisticsComponent.show();
    this._statisticsComponent.setStatFilterClickHandler(this._statFilterClickHandler);
  }

  _filterButtonsClickHandler() {
    this._pageController.show();
    this._statisticsComponent.hide();
  }
}

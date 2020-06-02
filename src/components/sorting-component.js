import {AbstractComponent} from "./abstract-component.js";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export class SortingComponent extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    const isDefaultSortActive = (this._currentSortType === SortType.DEFAULT) ? `sort__button--active` : ``;
    const isDateSortActive = (this._currentSortType === SortType.DATE) ? `sort__button--active` : ``;
    const isDatingSortActive = (this._currentSortType === SortType.RATING) ? `sort__button--active` : ``;

    return (
      `<ul class="sort">
        <li><a href="#" data-sort-type=${SortType.DEFAULT} class="sort__button ${isDefaultSortActive}">Sort by default</a></li>
        <li><a href="#" data-sort-type=${SortType.DATE} class="sort__button ${isDateSortActive}">Sort by date</a></li>
        <li><a href="#" data-sort-type=${SortType.RATING} class="sort__button ${isDatingSortActive}">Sort by rating</a></li>
      </ul>`);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }

  setDefaultSortType() {
    this._currentSortType = SortType.DEFAULT;
  }
}

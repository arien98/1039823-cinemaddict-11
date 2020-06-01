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
    return (
      `<ul class="sort">
        <li><a href="#" data-sort-type=${SortType.DEFAULT} class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" data-sort-type=${SortType.DATE} class="sort__button">Sort by date</a></li>
        <li><a href="#" data-sort-type=${SortType.RATING} class="sort__button">Sort by rating</a></li>
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

      this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);

      handler(this._currentSortType);
    });
  }
}

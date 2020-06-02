import {AbstractComponent} from "./abstract-component.js";

const createMenuItem = (name, count, isActive) => {
  const activeElement = isActive ? `main-navigation__item--active` : ``;
  return (
    `<a href="#${name}" class="main-navigation__item ${activeElement}" data-filter-type=${name}>
      ${name} ${(name === `all`) ? `movies` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createMenuTemplate = (filters) => {
  const filtersMarkup = filters
    .map((it) => createMenuItem(it.name, it.count, it.checked))
    .join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};

export class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }

  setFilterClickHandler(handler) {
    this.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((elem) => elem.addEventListener(`click`, (evt) => {
        const filterName = evt.target.dataset.filterType;
        handler(filterName);
      }));
  }

  setStatButtonClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, handler);
    this._statButtonClickHandler = handler;
  }
}

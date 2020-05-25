import {AbstractComponent} from "./abstract-component.js";
import {FilterType} from "../constants.js";

export const generateMenu = () => {
  const menuItems = Object.keys(FilterType);
  return menuItems.map((element) =>{
    return {
      name: element,
      count: Math.floor(Math.random() * 50)
    };
  });
};

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

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = evt.target.dataset.filterType;
      console.log(filterName);
      handler(filterName);
    });
  }
}

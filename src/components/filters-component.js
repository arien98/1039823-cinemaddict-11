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
  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
      ${name} ${(name === `all`) ? `movies` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createMenuTemplate = (menuItems) => {
  const menuMarkup = menuItems
    .map((it, i) => createMenuItem(it.name, it.count, i === 0))
    .join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${menuMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};

export class FiltersComponent extends AbstractComponent {
  constructor(menuData) {
    super();
    this._menuData = menuData;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }
}







export class MenuComponent extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }
}


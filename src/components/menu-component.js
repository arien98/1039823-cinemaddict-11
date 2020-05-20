import {AbstractComponent} from "./abstract-component.js";

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

export class MenuComponent extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }
}

const createMenuItem = (name, count, isActive) => {
  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
      ${name} ${(name === `all`) ? `movies` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

export const createMenuTemplate = (menuItems) => {
  const menuMarkup = menuItems
    .map((it, i) => createMenuItem(it.name, it.count, i === 0))
    .join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${menuMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>

    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`);
};

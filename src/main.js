import {ProfileComponent} from "./components/profile-component.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {generateFilms} from "./mocks/film.js";
import {renderElement, RenderPosition} from "./utils/render.js";
import {PageController} from "./controllers/page-controller.js";
import {MenuComponent} from "./components/menu-component.js";
import {generateMenu} from "./mocks/menu.js";

export const FilmsNumber = {
  TOTAL: 20,
  ON_START: 5,
  ON_BUTTON_CLICK: 5,
  TOP_RATED: 5,
  MOST_COMMENTED: 2
};

const filmsData = generateFilms(FilmsNumber.TOTAL);
const menuItems = generateMenu();

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

renderElement(siteHeader, new ProfileComponent());
renderElement(siteMain, new MenuComponent(menuItems), RenderPosition.BEGIN);

new PageController(siteMain).render(filmsData);

renderElement(footerStatisticsContainer, new FilmCountComponent());

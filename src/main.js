import {ProfileComponent} from "./components/profile-component.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {generateFilms} from "./mocks/film.js";
import {renderElement, RenderPosition} from "./utils/render.js";
import {PageController} from "./controllers/page-controller.js";
import {MenuComponent} from "./components/menu-component.js";
import {generateMenu} from "./mocks/menu.js";
import FilmsModel from "./models/films-model.js";

const TOTAL_FILMS_NUMBER = 20;

const filmsData = generateFilms(TOTAL_FILMS_NUMBER);
const menuItems = generateMenu();

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

renderElement(siteHeader, new ProfileComponent());
renderElement(siteMain, new MenuComponent(menuItems), RenderPosition.BEGIN);

new PageController(siteMain).render(filmsData, new FilmsModel());

renderElement(footerStatisticsContainer, new FilmCountComponent());

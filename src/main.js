import {ProfileComponent} from "./components/profile-component.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {generateFilms} from "./mocks/film.js";
import {renderElement, RenderPosition} from "./utils/render.js";
import {PageController} from "./controllers/page-controller.js";
import {generateMenu} from "./mocks/menu.js";
import {FilmsModel} from "./models/films-model.js";
import {FiltersComponent} from "./components/filters-component.js";

export const TOTAL_FILMS_NUMBER = 20;

const filmsData = generateFilms(TOTAL_FILMS_NUMBER);
const menuItems = generateMenu();

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);

const pageController = new PageController(siteMain, filmsModel);
const filterComponent = new FiltersComponent(menuItems);

renderElement(siteHeader, new ProfileComponent());
renderElement(siteMain, filterComponent, RenderPosition.BEGIN);

pageController.render();

renderElement(footerStatisticsContainer, new FilmCountComponent());

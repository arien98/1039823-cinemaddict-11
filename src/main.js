import {ProfileComponent} from "./components/profile-component.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {generateFilms} from "./mocks/film.js";
import {renderElement} from "./utils/render.js";
import {PageController} from "./controllers/page-controller.js";
import {FilmsModel} from "./models/films-model.js";
import {FilterController} from "./controllers/filter-controller.js";

const TOTAL_FILMS_NUMBER = 20;

const filmsData = generateFilms(TOTAL_FILMS_NUMBER);

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);

const pageController = new PageController(siteMain, filmsModel);
const filterController = new FilterController(siteMain, filmsModel);

renderElement(siteHeader, new ProfileComponent());

filterController.render();
pageController.render();

renderElement(footerStatisticsContainer, new FilmCountComponent());

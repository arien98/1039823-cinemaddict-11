import {ProfileComponent} from "./components/profile-component.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {generateFilms} from "./mocks/film.js";
import {renderElement} from "./utils/render.js";
import {PageController} from "./controllers/page-controller.js";
import {FilmsModel} from "./models/films-model.js";
import {FilterController} from "./controllers/filter-controller.js";
import {StatisticsComponent} from "./components/statistics-component.js";
import {FilterType} from "./constants.js";

const TOTAL_FILMS_NUMBER = 20;

const filmsData = generateFilms(TOTAL_FILMS_NUMBER);

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);

const statisticsComponent = new StatisticsComponent(filmsModel);
const pageController = new PageController(siteMain, filmsModel);
const filterController = new FilterController(siteMain, filmsModel);

renderElement(siteHeader, new ProfileComponent());

filterController.render();
pageController.render();

renderElement(siteMain, statisticsComponent);
statisticsComponent.getChart();

siteMain.addEventListener(`click`, (evt) => {
  const statsButton = evt.target.closest(`.main-navigation__additional`);
  const filterButton = evt.target.closest(`.main-navigation__item`);

  if (!statsButton && !filterButton) {
    return;
  }

  switch (evt.target) {
    case statsButton:
      pageController.hide();
      statisticsComponent.show();
      filmsModel.setFilter(FilterType.ALL);
      break;
    case filterButton:
      pageController.show();
      statisticsComponent.hide();
      break;
  }
});

renderElement(footerStatisticsContainer, new FilmCountComponent());

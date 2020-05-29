import {API} from "./api.js";
import {FilterType} from "./constants.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {FilmsModel} from "./models/films-model.js";
import {FilterController} from "./controllers/filter-controller.js";
import {PageController} from "./controllers/page-controller.js";
import {ProfileComponent} from "./components/profile-component.js";
import {renderElement} from "./utils/render.js";
import {StatisticsComponent} from "./components/statistics-component.js";

const AUTHORIZATION = `Basic 90fdsg9f7d9g78fd97g90a=4$jfkd`;

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION);
const filmsModel = new FilmsModel();
const statisticsComponent = new StatisticsComponent(filmsModel);
const pageController = new PageController(siteMain, filmsModel, api);
const filterController = new FilterController(siteMain, filmsModel);

renderElement(siteHeader, new ProfileComponent());

filterController.render();

api.getFilms()
  .then((films) => filmsModel.setFilms(films))
  .then(() => pageController.render());

renderElement(siteMain, statisticsComponent);
statisticsComponent.getChart();

renderElement(footerStatisticsContainer, new FilmCountComponent());

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

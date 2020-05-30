import {API} from "./api.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {FilmsModel} from "./models/films-model.js";
import {FilterController} from "./controllers/filter-controller.js";
import {PageController} from "./controllers/page-controller.js";
import {ProfileComponent} from "./components/profile-component.js";
import {renderElement} from "./utils/render.js";
import {StatisticsComponent} from "./components/statistics-component.js";

const AUTHORIZATION = `Basic 90fdsg9f7d9g78fd97g90a=4$jfkd`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
export const USER_NAME = `William Terner`;

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);


const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
let filterController = null;
let statisticsComponent = null;
let pageController = null;

renderElement(siteHeader, new ProfileComponent());

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    return Promise.all(films.map((film) => api.getComments(film.id)));
  })
  .then(() => {
    filterController = new FilterController(siteMain, filmsModel);
    statisticsComponent = new StatisticsComponent(filmsModel);
    pageController = new PageController(siteMain, filmsModel, api);

    filterController.render();
    pageController.render();
    renderElement(siteMain, statisticsComponent);
    statisticsComponent.getChart();
    renderElement(footerStatisticsContainer, new FilmCountComponent(filmsModel));

    const filterNav = siteMain.querySelector(`.main-navigation`);
    const statButton = siteMain.querySelector(`.main-navigation__additional`);

    filterNav.addEventListener(`click`, () => {
      pageController.show();
      statisticsComponent.hide();
    });

    statButton.addEventListener(`click`, () => {
      pageController.hide();
      statisticsComponent.show();
    });
  });



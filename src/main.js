import {API} from "./api/index.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {FilmsModel} from "./models/films-model.js";
import {FilterController} from "./controllers/filter-controller.js";
import {PageController} from "./controllers/page-controller.js";
import {ProfileComponent} from "./components/profile-component.js";
import {renderElement} from "./utils/render.js";
import {StatisticsComponent} from "./components/statistics-component.js";
import {Provider} from "./api/provider.js";
import {Store} from "./api/store.js";

navigator.serviceWorker.getRegistrations().then((registrations) => {
  for (let registration of registrations) {
    registration.unregister();
  }
});


const AUTHORIZATION = `Basic 90fdsds3f432d9g78fd97g90a=4$jfkd`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);


const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
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
    pageController = new PageController(siteMain, filmsModel, apiWithProvider);

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

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

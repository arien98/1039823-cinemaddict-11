import {API} from "./api/index.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {FilmsModel} from "./models/films-model.js";
import {FilterController} from "./controllers/filter-controller.js";
import {PageController} from "./controllers/page-controller.js";
import {ProfileComponent} from "./components/profile-component.js";
import {renderElement, remove} from "./utils/render.js";
import {StatisticsComponent} from "./components/statistics-component.js";
import {Provider} from "./api/provider.js";
import {Store} from "./api/store.js";
import LoadingTitleComponent from "./components/loading-title-component.js";

navigator.serviceWorker.getRegistrations().then((registrations) => {
  for (let registration of registrations) {
    registration.unregister();
  }
});

const AUTHORIZATION = `Basic 90fdsgfdg5943jfd97g90a=4$jfkd`;
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
let profileComponent = null;
const loadingComponent = new LoadingTitleComponent();

loadingComponent.render(siteMain);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);

    remove(loadingComponent);

    profileComponent = new ProfileComponent(filmsModel);
    filterController = new FilterController(siteMain, filmsModel);
    statisticsComponent = new StatisticsComponent(filmsModel, profileComponent);
    pageController = new PageController(siteMain, filmsModel, api, loadingComponent);

    renderElement(siteHeader, profileComponent);

    filterController.render();
    pageController.render();
    renderElement(siteMain, statisticsComponent);
    statisticsComponent.getChart();
    renderElement(footerStatisticsContainer, new FilmCountComponent(filmsModel));

    const filterNav = siteMain.querySelector(`.main-navigation__items`);
    const statButton = siteMain.querySelector(`.main-navigation__additional`);

    filterNav.addEventListener(`click`, () => {
      pageController.show();
      statisticsComponent.hide();
      statisticsComponent.removeStatFilterClickHandler(statFilterClickHandler);
    });

    statButton.addEventListener(`click`, () => {
      pageController.hide();
      statisticsComponent.show();
      statisticsComponent.setStatFilterClickHandler(statFilterClickHandler);
    });
  });

const statFilterClickHandler = (evt) => {
  const filterType = evt.target.dataset.filterType;
  statisticsComponent.setStatFilter(filterType);
  statisticsComponent.rerender();
};

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.syncFilms();

  apiWithProvider.syncComments();
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

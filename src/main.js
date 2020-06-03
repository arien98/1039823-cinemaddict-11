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

const AUTHORIZATION = `Basic 90fdsegfdgdg67g90a=4$jfkd`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaaddict-localstorage`;
const StoreDataType = {
  FILMS: `films`,
  COMMENTS: `comments`
};
const STORE_VER = `v5`;
const StoreNames = {
  FILMS: `${STORE_PREFIX}-${StoreDataType.FILMS}-${STORE_VER}`,
  COMMENTS: `${STORE_PREFIX}-${StoreDataType.COMMENTS}-${STORE_VER}`
};

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

const api = new API(END_POINT, AUTHORIZATION);
const storeFilms = new Store(StoreNames.FILMS, window.localStorage);
const storeComments = new Store(StoreNames.COMMENTS, window.localStorage);
const apiWithProvider = new Provider(api, storeFilms, storeComments);
const filmsModel = new FilmsModel();
let filterController = null;
let statisticsComponent = null;
let pageController = null;
let profileComponent = null;
const loadingComponent = new LoadingTitleComponent();

loadingComponent.render(siteMain);

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);

    remove(loadingComponent);

    profileComponent = new ProfileComponent(filmsModel);
    statisticsComponent = new StatisticsComponent(siteMain, filmsModel, profileComponent);

    pageController = new PageController(siteMain, filmsModel, apiWithProvider, loadingComponent);
    filterController = new FilterController(siteMain, filmsModel, statisticsComponent, pageController);

    renderElement(siteHeader, profileComponent);

    filterController.render();
    pageController.render();
    statisticsComponent.render();
    statisticsComponent.hide();
    renderElement(footerStatisticsContainer, new FilmCountComponent(filmsModel));
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (apiWithProvider.getSyncStatus()) {
    apiWithProvider.sync();
  }
});

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`/sw.js`)
//     .then(() => {
//       // Действие, в случае успешной регистрации ServiceWorker
//     }).catch(() => {
//       // Действие, в случае ошибки при регистрации ServiceWorker
//     });
// });

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

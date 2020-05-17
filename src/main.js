import {ProfileComponent} from "./components/profile-component.js";
import {MenuComponent} from "./components/menu-component.js";
import {FilmCardComponent} from "./components/film-card-component.js";
import {FilmCountComponent} from "./components/film-count-component.js";
import {FilmDetailsComponent} from "./components/film-details-component.js";
import {generateMenu} from "./mocks/menu.js";
import {generateFilms} from "./mocks/film.js";
import {renderElement, RenderPosition, remove} from "./utils/render.js";
import {PageController} from "./controllers/page-controller.js";

const TOTAL_FILMS_NUMBER = 20;
const TOP_RATED_FILMS_NUMBER = 2;
const MOST_COMMENTED_FILMS_NUMBER = 2;

const menuItems = generateMenu();
const filmsData = generateFilms(TOTAL_FILMS_NUMBER);

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const filmListContainer = siteMain.querySelector(`.films-list__container`);
const topRatedContainer = siteMain.querySelector(`.top-rated`);
const mostCommentedContainer = siteMain.querySelector(`.most-commented`);
const footerStatisticsContainer = document.querySelector(`.footer__statistics`);

const renderFilms = (start, end, container, films = filmsData) => {
  films
    .slice(start, end)
    .forEach((film) => {
      renderFilm(film, container);
    });
};

const renderFilm = (film, place) => {
  const filmComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const filmClickHandler = () => {
    renderElement(siteMain, filmDetailsComponent);
    filmDetailsComponent.setCloseButtonHandler(closeDetailsButtonHandler);
    document.addEventListener(`keydown`, escPressHandler);
  };

  const closeDetailsButtonHandler = () => {
    remove(filmDetailsComponent);
    filmDetailsComponent.removeCloseButtonHandler(closeDetailsButtonHandler);
    document.removeEventListener(`keydown`, escPressHandler);
  };

  const escPressHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeDetailsButtonHandler();
    }
  };

  filmComponent.setClickHandler(filmClickHandler);

  renderElement(place, filmComponent);
};

renderElement(siteHeader, new ProfileComponent());
renderElement(siteMain, new MenuComponent(menuItems), RenderPosition.BEGIN);

new PageController(filmListContainer).render(filmsData);

renderFilms(0, TOP_RATED_FILMS_NUMBER, topRatedContainer);
renderFilms(0, MOST_COMMENTED_FILMS_NUMBER, mostCommentedContainer);
renderElement(footerStatisticsContainer, new FilmCountComponent());

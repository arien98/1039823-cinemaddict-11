import {ProfileComponent} from "./components/profile.js";
import {MenuComponent} from "./components/menu.js";
import {FilmCardComponent} from "./components/film-card.js";
import {ShowButtonComponent} from "./components/show-button.js";
import {FilmCountComponent} from "./components/film-count.js";
import {FilmDetailsComponent} from "./components/film-details.js";
import {generateMenu} from "./mocks/menu.js";
import {generateFilms} from "./mocks/film.js";
import {renderElement, RenderPosition} from "./utils.js";

const FILMS_NUMBER_ON_START = 5;
const FILMS_NUMBER_ON_BUTTON_CLICK = 5;
const TOTAL_FILMS_NUMBER = 20;
const TOP_RATED_FILMS_NUMBER = 2;
const MOST_COMMENTED_FILMS_NUMBER = 2;

const menuItems = generateMenu();
const films = generateFilms(TOTAL_FILMS_NUMBER);

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const siteBody = document.querySelector(`.body`);
const filmList = siteMain.querySelector(`.films-list`);
const filmListContainer = siteMain.querySelector(`.films-list__container`);
const topRatedContainer = siteMain.querySelector(`.top-rated`);
const mostCommentedContainer = siteMain.querySelector(`.most-commented`);
const footerStatisticsContainer = siteMain.querySelector(`.footer__statistics`);

const renderFilms = (start, end, container) => {
  films
    .slice(start, end)
    .forEach((film) => {
      renderFilm(film, container);
    });
};

const renderFilm = (film, place) => {
  const filmComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);
  const filmElements = filmComponent.getElement().querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`);
  const closeDetailsButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const filmClickHandler = () => {
    siteBody.append(filmDetailsComponent.getElement());
  };

  const closeDetailsButtonHandler = () => {
    siteBody.remove(filmDetailsComponent.getElement());
  };

  filmElements.forEach((element) => element.addEventListener(`click`, filmClickHandler));
  closeDetailsButton.addEventListener(`click`, closeDetailsButtonHandler);

  renderElement(place, filmComponent.getElement(), RenderPosition.END);
};

const renderBoard = () => {
  renderFilms(0, FILMS_NUMBER_ON_START, filmListContainer);
  renderElement(filmList, new ShowButtonComponent().getElement(), RenderPosition.END);

  const showButton = document.querySelector(`.films-list__show-more`);
  let filmsOnPageNumber = FILMS_NUMBER_ON_START;

  const showButtonClickHandler = () => {
    let prevFilmsNumber = filmsOnPageNumber;
    filmsOnPageNumber += FILMS_NUMBER_ON_BUTTON_CLICK;

    renderFilms(prevFilmsNumber, filmsOnPageNumber, filmListContainer);

    if (filmsOnPageNumber >= TOTAL_FILMS_NUMBER) {
      showButton.remove();
      showButton.removeEventListener(`click`, showButtonClickHandler);
    }
  };

  showButton.addEventListener(`click`, showButtonClickHandler);
};

renderElement(siteHeader, new ProfileComponent().getElement(), RenderPosition.END);
renderElement(siteMain, new MenuComponent(menuItems).getElement(), RenderPosition.BEGIN);

renderElement(siteMain, new FilmCardComponent(films[0]).getElement(), RenderPosition.END);

renderBoard();

renderFilms(0, TOP_RATED_FILMS_NUMBER, topRatedContainer);
renderFilms(0, MOST_COMMENTED_FILMS_NUMBER, mostCommentedContainer);

renderElement(footerStatisticsContainer, new FilmCountComponent().getElement(), RenderPosition.END);

import {createProfileTemplate} from "./components/profile.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowButtonTemplate} from "./components/show-button.js";
import {createFilmCountTemplate} from "./components/film-count.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";
import {generateMenu} from "./mocks/menu.js";
import {generateFilms} from "./mocks/film.js";

const FILMS_NUMBER_ON_START = 5;
const FILMS_NUMBER_ON_BUTTON_CLICK = 5;
const TOTAL_FILMS_NUMBER = 20;
const TOP_RATED_FILMS_NUMBER = 2;
const MOST_COMMENTED_FILMS_NUMBER = 2;

const renderFilms = (start, end) => {
  films
    .slice(start, end)
    .forEach((film) => {
      renderElement(`.films-list__container`, createFilmCardTemplate(film), `beforeend`);
    });
};

const menuItems = generateMenu();
const films = generateFilms(TOTAL_FILMS_NUMBER);

const renderElement = (place, template, position) => {
  document.querySelector(place).insertAdjacentHTML(position, template);
};

renderElement(`.header`, createProfileTemplate(), `beforeend`);
renderElement(`.main`, createMenuTemplate(menuItems), `afterbegin`);

renderFilms(0, FILMS_NUMBER_ON_START);

let filmsOnPageNumber = FILMS_NUMBER_ON_START;

renderElement(`.films-list`, createShowButtonTemplate(), `beforeend`);

films.slice(0, TOP_RATED_FILMS_NUMBER)
  .forEach((film) => {
    renderElement(`.top-rated`, createFilmCardTemplate(film), `beforeend`);
  });

films.slice(0, MOST_COMMENTED_FILMS_NUMBER)
  .forEach((film) => {
    renderElement(`.most-commented`, createFilmCardTemplate(film), `beforeend`);
  });

renderElement(`.footer__statistics`, createFilmCountTemplate(), `beforeend`);
renderElement(`body`, createFilmDetailsTemplate(films[0]), `beforeend`);

const showButton = document.querySelector(`.films-list__show-more`);

const showButtonClickHandler = () => {
  let prevFilmsNumber = filmsOnPageNumber;
  filmsOnPageNumber += FILMS_NUMBER_ON_BUTTON_CLICK;

  renderFilms(prevFilmsNumber, filmsOnPageNumber);

  if (filmsOnPageNumber >= TOTAL_FILMS_NUMBER) {
    showButton.remove();
    showButton.removeEventListener(`click`, showButtonClickHandler);
  }
};

showButton.addEventListener(`click`, showButtonClickHandler);



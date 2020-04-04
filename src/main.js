import {createProfileTemplate} from "./components/profile.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowButtonTemplate} from "./components/show-button.js";
import {createFilmCountTemplate} from "./components/film-count.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";

const CARDS_NUMBER = 5;
const TOP_RATED_FILMS_NUMBER = 2;
const MOST_COMMENTED_FILMS_NUMBER = 2;

const renderElement = (place, template, position) => {
  document.querySelector(place).insertAdjacentHTML(position, template);
};

renderElement(`.header`, createProfileTemplate(), `beforeend`);
renderElement(`.main`, createMenuTemplate(), `afterbegin`);
for (let i = 0; i < CARDS_NUMBER; i++) {
  renderElement(`.films-list__container`, createFilmCardTemplate(), `beforeend`);
}
renderElement(`.films-list`, createShowButtonTemplate(), `beforeend`);
for (let i = 0; i < TOP_RATED_FILMS_NUMBER; i++) {
  renderElement(`.top-rated`, createFilmCardTemplate(), `beforeend`);
}
for (let i = 0; i < MOST_COMMENTED_FILMS_NUMBER; i++) {
  renderElement(`.most-commented`, createFilmCardTemplate(), `beforeend`);
}
renderElement(`.footer__statistics`, createFilmCountTemplate(), `beforeend`);
renderElement(`body`, createFilmDetailsTemplate(), `beforeend`);

import {createElement} from "../utils.js";

const createFilmCountTemplate = () => {
  return `<p>130 291 movies inside</p>`;
};

export class FilmCount {
  constractor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmCountTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

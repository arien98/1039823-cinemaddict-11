import {createElement} from "../utils.js";

export class FilmCountComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `<p>130 291 movies inside</p>`;
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

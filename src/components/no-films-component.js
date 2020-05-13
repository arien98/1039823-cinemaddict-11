import {createElement} from "../utils.js";

export class NoFilmsComponents {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `<h2 class="films-list__title">There are no movies in our database</h2>`;
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

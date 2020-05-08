import {createElement} from "../utils.js";

export class ShowButtonComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
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
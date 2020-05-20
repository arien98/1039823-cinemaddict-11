import {AbstractComponent} from "./abstract-component.js";

export class ShowButtonComponent extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  removeClickHandler(handler) {
    this.getElement().removeEventListener(`click`, handler);
  }
}

import {AbstractComponent} from "./abstract-component.js";

export class NoFilmsComponents extends AbstractComponent {
  getTemplate() {
    return `<h2 class="films-list__title">There are no movies in our database</h2>`;
  }
}

import {AbstractComponent} from "./abstract-component";

export class FilmCountComponent extends AbstractComponent {
  getTemplate() {
    return `<p>130 291 movies inside</p>`;
  }
}

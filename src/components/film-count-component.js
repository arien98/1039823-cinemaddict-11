import {AbstractComponent} from "./abstract-component";

export class FilmCountComponent extends AbstractComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
  }
  getTemplate() {
    this._filmsCount = this._filmsModel.getFilmsAll().length;
    return `<p>${this._filmsCount} movies inside</p>`;
  }
}

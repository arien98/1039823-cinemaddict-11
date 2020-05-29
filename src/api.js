export class API {
  constructor() {}

  getFilms() {
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict`);
  }
}

import {FilmModel} from "./models/film-model";
import {CommentModel} from "./models/comment-model";

export class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then((response) => response.json())
      .then(FilmModel.parseFilms);
  }

  getComments(id) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    console.log(id);
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${id}`, {headers})
      .then((response) => response.json())
      .then(CommentModel.parseComments);
  }

  updateFilm(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data),
      headers,
    })
      .then((response) => response.json())
      .then(FilmModel.parseFilms);
  }

  // addComment(filmId, data) {
  //   const headers = new Headers();
  //   headers.append(`Authorization`, this._authorization);
  //   return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${FilmId}`, {
  //     method: `PUT`,
  //     body: JSON.stringify(data),
  //     headers,
  //   })
  //     .then((response) => response.json())
  //     .then(FilmModel.parseFilms);
  // }
}

import {FilmModel} from "../models/film-model";
import {CommentModel} from "../models/comment-model";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json()
      .then(FilmModel.parseFilms));
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(CommentModel.parseComments);
  }

  updateFilm(id, newFilm) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(newFilm.toRaw()),
      headers: new Headers({"Content-type": `application/json`})
    })
      .then((response) => response.json()
      .then(FilmModel.parseFilm));
  }

  createComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(CommentModel.parseComment);
  }

  deleteComment(commentId) {
    return this._load({url: `comments/${commentId}`, method: Method.DELETE});
  }

  sync(films) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

import {FilmModel} from "../models/film-model.js";
import {nanoid} from "nanoid";
import {CommentModel} from "../models/comment-model.js";
import {DataType} from "../constants";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedData = (items, dataType) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload[dataType]);
};

const createStoreStructure = (items, dataType) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [dataType + current.id]: current
    });
  }, {});
};

export class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map((film) => film.toRaw()), DataType.FILM);

          this._store.setItems(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          const items = createStoreStructure(comments.map((comment) => comment.toRaw()), DataType.COMMENT);

          this._store.setItems(items);

          return comments;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  createComment(comment) {
    if (isOnline()) {
      return this._api.createComment(comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, newComment.toRaw());

          return newComment;
        });
    }

    const localNewFilmId = nanoid();
    const localNewFilm = CommentModel.clone(Object.assign(comment, {id: localNewFilmId}));

    this._store.setItem(localNewFilm.id, localNewFilm.toRaw());

    return Promise.resolve(localNewFilm);
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm.toRaw());

          return newFilm;
        });
    }

    const localTask = FilmModel.clone(Object.assign(film, {id}));

    this._store.setItem(id, localTask.toRaw());

    return Promise.resolve(localTask);
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._store.removeItem(`comment${id}`));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  syncFilms() {
    if (isOnline()) {
      const storeFilms = this._store.getFilms();

      return this._api.sync(storeFilms)
        .then((response) => {

          const updatedFilms = getSyncedData(response.updated);

          const items = createStoreStructure(updatedFilms, DataType.FILM);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  syncComments() {
    if (isOnline()) {
      const storeComments = this._store.getComments();

      return this._api.sync(storeComments)
        .then((response) => {

          const createdComments = getSyncedData(response.created);

          const items = createStoreStructure(createdComments, DataType.COMMENT);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

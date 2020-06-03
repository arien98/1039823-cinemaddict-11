import {FilmModel} from "../models/film-model.js";
import {nanoid} from "nanoid";
import {CommentModel} from "../models/comment-model.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedFilms = (films) => {
  return films.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current
    });
  }, {});
};

const filterLocalComments = (filmId, comments) => {
  return comments.find((comment) => {
    return comment.id === filmId;
  });
};

export class Provider {
  constructor(api, storeFilms, storeComments) {
    this._api = api;
    this._storeFilms = storeFilms;
    this._storeComments = storeComments;
    this._synsRequired = false;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const locaFilms = createStoreStructure(films.map((film) => film.toRaw()));

          this._storeFilms.setItems(locaFilms);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {

          const localStoreComments = createStoreStructure(comments.map((comment) => comment.toRaw()));

          this._storeComments.setItem(filmId, localStoreComments);

          return comments;
        });
    }

    const storeComments = Object.values(this._storeComment.getItems());

    const localCommentsFilm = filterLocalComments(filmId, storeComments);

    return Promise.resolve(CommentModel.parseComments(localCommentsFilm.commentsFilm));
  }

  createComment(filmId, comment) {
    if (isOnline()) {
      return this._api.createComment(filmId, comment)
        .then((response) => {
          const newComments = response.comments;
          const commentsToStore = createStoreStructure(newComments.map((elem) => elem.toRaw()));
          this._storeComments.setItem(filmId, commentsToStore);

          const newFilm = response.movie;
          this._storeFilms.setItem(newFilm.id, newFilm.toRaw());

          return {newFilm, newComments};
        })
        .catch((err) => console.log(err));
    }

    this._synsRequired = true;

    const localNewFilmId = nanoid();
    const localNewFilm = FilmModel.clone(Object.assign(comment, {id: localNewFilmId}));

    this._storeComments.setItem(localNewFilm.id, localNewFilm.toRaw());

    return Promise.resolve(localNewFilm);
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._storeFilms.setItem(newFilm.id, newFilm.toRaw());

          return newFilm;
        });
    }

    this._synsRequired = true;

    const localFilm = FilmModel.clone(Object.assign(film, {id}));

    this._storeFilms.setItem(id, localFilm.toRaw());

    return Promise.resolve(localFilm);
  }

  deleteComment(filmId, id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._storeComments.removeItem(id);
          // debugger;
          const localCommentsAll = this._storeComments.getItems();
          const localComments = Object.values(localCommentsAll[filmId]);

          const index = localComments.findIndex((it) => it.id === id);

          const updatedComments = [].concat(localComments.slice(0, index), localComments.slice(index + 1));

          console.log(updatedComments);

          const commentsToStore = createStoreStructure(updatedComments);
          this._storeComments.setItem(filmId, commentsToStore);
        })
        .catch((err) => console.log(err));
    }

    this._synsRequired = true;

    this._storeComments.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._storeFilms.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);

          const items = createStoreStructure([...updatedFilms]);

          this._storeFilms.setItems(items);

          this._synsRequired = false;
        });
    }

    return Promise.reject(new Error(`Синхронизация данных не удалась`));
  }

  getSyncStatus() {
    return this._synsRequired;
  }
}

import {DataType} from "../constants";

const RegExps = {
  FILM: `\^${DataType.FILM}`,
  COMMENTS: `\^${DataType.COMMENT}`
};

export class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getFilms() {
    return this
      .getItems()
      .filter((it) => RegExps.FILM.test(it.id))
      .forEach((element) => {
        element.id.slice(DataType.FILM.length);
      });
  }

  getComments() {
    return this
      .getItems()
      .filter((it) => RegExps.FILM.test(it.id))
      .forEach((element) => {
        element.id.slice(DataType.COMMENT.length);
      });
  }

  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}

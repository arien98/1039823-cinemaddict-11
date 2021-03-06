export class CommentsModel {
  constructor(film, filmsModel) {
    this._film = film;
    this._filmsModel = filmsModel;
    this._comments = [];
    this._dataChangeHandlers = [];
  }

  getComments() {
    return this._comments;
  }

  getCommentById(id) {
    return this._comments.find((it) => it.id === id);
  }

  getCommentsId() {
    return this._comments.map((it) => {
      return it.id;
    });
  }

  setComments(comments) {
    this._comments = Array.from(comments);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  removeComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addComment(comment) {
    this._comments = [].concat(this._comments, comment);
    this._callHandlers(this._dataChangeHandlers);
  }
}

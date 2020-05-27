import {AbstractComponent} from "./abstract-component.js";
import moment from "moment";

const createCommentsTemplate = (film) => {
  return film.comments
    .map((comment) => {
      const {emoji, text, author, date} = comment;
      const dateMarkup = moment(date).format(`MMMM Do YYYY`);

      return (
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
          </span>
          <div>
            <p class="film-details__comment-text">${text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${dateMarkup}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
    })
    .join(`\n`);
};

export class CommentsComponent extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createCommentsTemplate(this._film);
  }
}

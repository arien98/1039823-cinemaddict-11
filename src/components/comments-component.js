import {AbstractComponent} from "./abstract-component.js";
import moment from "moment";

const createCommentsTemplate = (comments) => {
  return comments
    .map((comment) => {
      const {id, emoji, text, author, date} = comment;
      const dateMarkup = moment(date).format(`MMMM Do YYYY`);

      return (
        `<li class="film-details__comment" id=${id}>
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
  constructor(commentsModel) {
    super();
    this._commentsModel = commentsModel;
  }

  getTemplate() {
    return createCommentsTemplate(this._commentsModel.getComments());
  }
}

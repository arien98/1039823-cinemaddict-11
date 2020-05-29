export class CommentModel {
  constructor(data) {
    this.id = data.id;
    this.emoji = data.emotion;
    this.text = data.comment;
    this.author = data.author;
    this.day = data.date;
  }

  static parseComment(data) {
    return new CommentModel(data);
  }

  static parseComments(data) {
    return data.map(CommentModel.parseComment);
  }
}

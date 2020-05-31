export class CommentModel {
  constructor(data) {
    this.id = data.id;
    this.emoji = data.emotion;
    this.text = data.comment;
    this.author = data.author;
    this.date = new Date(data.date);
  }

  static parseComment(data) {
    return new CommentModel(data);
  }

  static parseComments(data) {
    return data.map(CommentModel.parseComment);
  }

  static clone(data) {
    return new CommentModel(data.toRaw());
  }

  toRaw() {
    return {
      "id": this.id,
      "comment": this.text,
      "date": this.day,
      "emotion": this.emoji
    };
  }
}

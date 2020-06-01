export class CommentModel {
  constructor(incomedata) {
    this.id = incomedata.id;
    this.emoji = incomedata.emotion;
    this.text = incomedata.comment;
    this.author = incomedata.author;
    this.date = new Date(incomedata.date);
  }

  static parseComment(incomedata) {
    return new CommentModel(incomedata);
  }

  static parseComments(incomedata) {
    return incomedata.map(CommentModel.parseComment);
  }

  static clone(incomedata) {
    return new CommentModel(incomedata.toRaw());
  }

  toRaw() {
    return {
      "id": this.id,
      "comment": this.text,
      "date": this.date.toISOString(),
      "emotion": this.emoji
    };
  }
}

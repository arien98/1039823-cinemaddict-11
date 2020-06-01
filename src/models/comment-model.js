export class CommentModel {
  constructor(incomeData) {
    this.id = incomeData.id;
    this.emoji = incomeData.emotion;
    this.text = incomeData.comment;
    this.author = incomeData.author;
    this.date = new Date(incomeData.date);
  }

  static parseComment(incomeData) {
    return new CommentModel(incomeData);
  }

  static parseComments(incomeData) {
    return incomeData.map(CommentModel.parseComment);
  }

  static clone(incomeData) {
    return new CommentModel(incomeData);
  }

  // static createEmptyComment() {
  //   return new CommentModel({
  //     "id": `unknown`,
  //     "comment": `unknown`,
  //     "date": `unknown`,
  //     "emotion": `unknown`,
  //     "author": `unknown`
  //   });
  // }

  toRaw() {
    return {
      "id": this.id,
      "comment": this.text,
      "date": this.date.toISOString(),
      "emotion": this.emoji
    };
  }
}

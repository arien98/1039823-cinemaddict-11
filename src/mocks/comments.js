import {getRandomIntegerNumber} from "../utils.js";

const CommentEmoji = [`angry`, `puke`, `sleeping`, `smile`];
const CommentText = [
  `Almost two hours? Seriously?`,
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Interesting setting and a good cast`
];
const CommentAuthor = [`John Doe`, `Tim Macoveev`, `Jerald Bathler`, `Julie Roberts`, `Kathe Blanchet`];

const createComment = () => {
  return {
    emoji: CommentEmoji[getRandomIntegerNumber(0, CommentEmoji.length)],
    text: CommentText[getRandomIntegerNumber(0, CommentText.length)],
    author: CommentAuthor[getRandomIntegerNumber(0, CommentAuthor.length)],
    day: new Date()
  };
};

export const createCommentData = (count) => {
  return new Array(count)
    .fill(``)
    .map(createComment);
};

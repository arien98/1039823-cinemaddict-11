import {getRandomArrayItem} from "../utils/common.js";

const COMMENT_EMOJIS = [`angry`, `puke`, `sleeping`, `smile`];
const COMMENT_TEXTS = [
  `Almost two hours? Seriously?`,
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Interesting setting and a good cast`
];
const COMMENT_AUTHORS = [`John Doe`, `Tim Macoveev`, `Jerald Bathler`, `Julie Roberts`, `Kathe Blanchet`];

const generateComment = () => {
  return {
    id: String(Math.random()),
    emoji: getRandomArrayItem(COMMENT_EMOJIS),
    text: getRandomArrayItem(COMMENT_TEXTS),
    author: getRandomArrayItem(COMMENT_AUTHORS),
    day: new Date()
  };
};

export const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};



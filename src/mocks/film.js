import {getRandomIntegerNumber} from "../utils.js";
import {getRandomArrayItem} from "../utils.js";
import {getRandomArrayItems} from "../utils.js";
import {generateComments} from "./comments.js";


const FilmTitles = [
  `Made for each other`,
  `Popeye meets sinbad`,
  `Sagebrush trail`,
  `Santa Cluas conquers the martians`,
  `The dance of life`,
  `The great flamarion`,
  `The man with the golden arm`
];

const FilmGenres = [
  `Romance`,
  `Science`,
  `Horror`,
  `Documentary`,
  `Action`,
  `Drama`,
  `Comedy`,
  `Adventure`
];

const FilmSources = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];

const FilmDescriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const AGES = [`+6`, `12+`, `18+`];

const NAMES = [
  `Anthony Mann`,
  `Guy Ritchie`,
  `Rian Johnson`,
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`,
  `Matthew McConaughey`,
  `Charlie Hunnam`,
  `Michelle Dockery`
];

const COUNTRIES = [`USA`, `Japan`, `China`, `Russia`, `Mexico`];

const createFilmData = () => {
  let i = getRandomIntegerNumber(0, FilmTitles.length);

  return {
    title: FilmTitles[i],
    originalTitile: `Original: ${FilmTitles[i]}`,
    rating: Math.floor(Math.random() * 100) / 10,
    year: getRandomIntegerNumber(1900, 2000),
    duration: `${getRandomIntegerNumber(0, 3)}h ${getRandomIntegerNumber(0, 59)}m`,
    genres: [getRandomArrayItem(FilmGenres), getRandomArrayItem(FilmGenres)],
    posterSrc: FilmSources[i],
    description: getRandomArrayItems(FilmDescriptions, getRandomIntegerNumber(1, 5)).join(` `),
    comments: generateComments(getRandomIntegerNumber(0, 5)),
    age: getRandomArrayItem(AGES),
    director: getRandomArrayItem(NAMES),
    writers: getRandomArrayItems(NAMES, 3),
    actors: getRandomArrayItems(NAMES, 3),
    releaseDate: new Date(),
    country: getRandomArrayItem(COUNTRIES)
  };
};

export const generateFilms = (number) => {
  return new Array(number)
    .fill(``)
    .map(createFilmData);
};

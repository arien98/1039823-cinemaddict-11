export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomArrayItems = (array, number) => {
  let oldArray = [...array];
  let length = oldArray.length;
  let newArray = [];

  for (let i = 0; i < number; i++) {
    const randomIndex = getRandomIntegerNumber(0, length);

    newArray.push(oldArray[randomIndex]);
    oldArray.splice(randomIndex, 1);
    length--;
  }
  return newArray;
};

export const getUniqueItems = (arr) => {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
};

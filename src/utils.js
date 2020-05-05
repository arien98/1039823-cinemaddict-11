export const RenderPosition = {
  BEGIN: `afterbegin`,
  END: `beforeend`
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomArrayItems = (array, number) => {
  let length = array.length;
  let newArray = [];

  for (let i = 0; i < number; i++) {
    const randomIndex = getRandomIntegerNumber(0, length);

    newArray.push(array[randomIndex]);
    array.splice(randomIndex, 1);
    length--;
  }
  return newArray;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.END:
      container.append(element);
      break;
  }
};

import {FilterType} from "../constants.js";

export const generateMenu = () => {
  const menuItems = Object.keys(FilterType);
  return menuItems.map((element) =>{
    return {
      name: element,
      count: Math.floor(Math.random() * 50)
    };
  });
};

const MENU_ITEMS = [`all`, `watchlist`, `history`, `favorites`];

export const generateMenu = () => {
  return MENU_ITEMS.map((element) =>{
    return {
      name: element,
      count: Math.floor(Math.random() * 50)
    };
  });
};

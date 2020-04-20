const menuItems = [`all`, `watchlist`, `history`, `favorites`];

export const generateMenu = () => {
  return menuItems.map((element) =>{
    return {
      name: element,
      count: Math.floor(Math.random() * 50)
    };
  });
};

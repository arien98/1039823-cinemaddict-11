export const RenderPosition = {
  BEGIN: `afterbegin`,
  END: `beforeend`,
  AFTER: `afterend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderElement = (container, component, place = RenderPosition.END) => {
  switch (place) {
    case RenderPosition.BEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.END:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTER:
      container.after(component.getElement());
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

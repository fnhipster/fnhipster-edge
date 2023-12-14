export function CustomElement(tagName, args) {
    if (!tagName) throw new Error('tagName is required');
    
    const element = document.createElement(tagName);

    // get all the args and set them as attributes on the element
    // if the attribute starts on "on" (onClick) then add an event listener
    Object.entries(args).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, value);
        return;
      }

      element.setAttribute(key, value.toString());
    });

    return element;
}
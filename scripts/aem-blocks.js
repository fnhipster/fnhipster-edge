/* eslint-disable max-classes-per-file */

export class Block extends HTMLElement {
  constructor() {
    super();

    const id = this.tagName.toLowerCase();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const template = document.getElementById(id);

    if (template) {
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

export class MetaBlock extends Block {
  metadata = new Map();

  constructor() {
    super();

    const slots = this.querySelectorAll('[slot]');

    slots.forEach((element) => {
      const [key, value] = element.children;

      this.metadata.set(key.innerText, value.innerHTML);

      element.setAttribute('slot', key.innerText);
      element.innerHTML = value.innerHTML;
    });
  }
}

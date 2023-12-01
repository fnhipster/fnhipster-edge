/* eslint-disable max-classes-per-file */

export class Block extends HTMLElement {
  data = new Set();

  constructor() {
    super();

    const id = this.tagName.toLowerCase();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const template = document.getElementById(id);

    if (template) {
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    const slots = this.querySelectorAll('[slot="item"]');

    slots.forEach((element) => {
      this.data.add(element);
    });
  }
}

export class MetaBlock extends Block {
  data = new Map();

  constructor() {
    super();

    const slots = this.querySelectorAll('[slot]');

    slots.forEach((element) => {
      const [key, value] = element.children;

      this.data.set(key.innerText, value.innerHTML);

      element.setAttribute('slot', key.innerText);
      element.innerHTML = value.innerHTML;
    });
  }
}

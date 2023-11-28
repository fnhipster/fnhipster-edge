/* eslint-disable max-classes-per-file */

export class Block extends HTMLElement {
  constructor() {
    super();

    const id = this.tagName.toLowerCase();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const template = document.getElementById(id);

    if (template) {
      shadowRoot.appendChild(template.content.cloneNode(true));
    } else {
      // eslint-disable-next-line no-console
      console.error(`Template not found for <${id}>`);
    }
  }
}

export class Metadata extends HTMLElement {
  metadata = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.querySelectorAll('[slot]').forEach((element) => {
      const slotName = element.slot;
      const slotValue = element.innerHTML;

      this.metadata.set(slotName, slotValue);
    });
  }
}

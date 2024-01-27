const tagName = 'fn-section';

const template = document.createElement('template');

template.innerHTML = /* html */ `
  <style>
    :host([layout="centered"]) {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    slot {
      display: block;
    }
  </style>

  <slot></slot>
`;

export default class Section extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Section);

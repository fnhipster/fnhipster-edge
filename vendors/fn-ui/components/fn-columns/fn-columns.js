const tagName = 'fn-columns';

export default class Columns extends HTMLElement {
  static get observedAttributes() {
    return ['columns'];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          --gap: var(--spacing-sm);
          display: grid;
          grid-gap: var(--gap);
          --columns: 1;
        }

       
        @media (width >= 650px) {
          :host {
            --gap: var(--spacing-md);
            --columns: var(--size);
          }
        }
      </style>

      <slot name="row"></slot>
    `;
  }

  connectedCallback() {
    this.style.setProperty('--size', this.children[0].children.length);

    // apply display grid to children
    [...this.children].forEach((child) => {
      child.style.setProperty('display', 'grid');
      child.style.setProperty('grid-gap', 'var(--gap)');
      child.style.setProperty('grid-template-columns', 'repeat(var(--columns), 1fr)');
    });
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Columns);

import { Brick } from '../../scripts/aem.js';

export default class Hero extends Brick {
  connectedCallback() {
    this.injectMoreContent = (elem) => {
      const title = elem.querySelector('h1').textContent;

      if (title) {
        this.shadowRoot.querySelector('fn-hero').setAttribute('title', title);
      }
    };
  }
}

import { Block } from '../../scripts/aem.js';

export default class SectionMetadata extends Block {
  constructor() {
    super({ mapValues: true });
  }

  connectedCallback() {
    [...this.values].forEach(([key, value]) => {
      if (key === 'style') {
        this.parentElement.classList.add(value);
      } else {
        this.parentElement.dataset[key] = value;
      }
    });
  }
}

import { MetaBlock } from '../../scripts/aem-blocks.js';

export default class SectionMetadata extends MetaBlock {
  connectedCallback() {
    [...this.metadata].forEach(([key, value]) => {
      if (key === 'style') {
        this.parentElement.classList.add(value);
      } else {
        this.parentElement.dataset[key] = value;
      }
    });
  }
}

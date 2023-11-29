import { Block } from '../../scripts/aem-blocks.js';

export default class Hero extends Block {
  constructor() {
    super();

    const item = this.querySelector('div[slot="item"]');
    const image = item.querySelector('picture');
    const heading = item.querySelector('p + *');
    this.innerHTML = '';

    image?.querySelectorAll('img').forEach((img) => {
      // Eager
      img.setAttribute('loading', 'eager');
    });

    this.shadowRoot.querySelector('slot[name="image"]').append(image);
    this.shadowRoot.querySelector('slot[name="heading"]').append(heading);
  }
}

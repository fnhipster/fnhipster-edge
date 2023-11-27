import { Block } from '../../scripts/aem-blocks.js';

export default class Hero extends Block {
  image;

  heading;

  constructor() {
    super();

    const item = this.querySelector('div[slot="item"]');

    this.image = item.querySelector('picture');
    this.heading = item.querySelector('p + *');

    // Clean DOM
    item.remove();
  }

  connectedCallback() {
    this.shadowRoot.querySelector('slot[name="image"]').append(this.image);
    this.shadowRoot.querySelector('slot[name="heading"]').append(this.heading);
  }
}

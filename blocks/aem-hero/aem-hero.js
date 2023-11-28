import { Block } from '../../scripts/aem-blocks.js';

export default class Hero extends Block {
  image;

  heading;

  constructor() {
    super();

    const item = this.querySelector('div[slot="item"]');
    this.image = item.querySelector('aem-image');
    this.heading = item.querySelector('p + *');
    this.innerHTML = '';
  }

  connectedCallback() {
    this.shadowRoot.querySelector('slot[name="image"]').append(this.image);
    this.shadowRoot.querySelector('slot[name="heading"]').append(this.heading);
  }
}

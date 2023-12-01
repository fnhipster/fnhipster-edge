import { Block } from '../../scripts/aem-blocks.js';

export default class Hero extends Block {
  constructor() {
    super();

    const [item] = this.data;
    const image = item.querySelector('picture');
    const heading = item.querySelector('p + *');
    this.innerHTML = '';

    this.shadowRoot.querySelector('slot[name="image"]').append(image);
    this.shadowRoot.querySelector('slot[name="heading"]').append(heading);
  }
}

import { Block } from '../../scripts/aem-blocks.js';

export default class Image extends Block {
  constructor() {
    super();

    const picture = document.createElement('picture');

    picture.innerHTML = this.innerHTML;

    this.innerHTML = '';

    this.shadowRoot.querySelectorAll('slot[name="picture"]').forEach((slot) => {
      slot.innerHTML = picture.outerHTML;
    });
  }
}

import { Block } from '../../scripts/aem-blocks.js';

export default class Footer extends Block {
  constructor() {
    super();
    this.shadowRoot.querySelector('slot').innerHTML = this.innerHTML;
    this.innerHTML = '';
  }
}

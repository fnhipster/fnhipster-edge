import { Brick } from '../../scripts/aem.js';

export default class Hero extends Brick {
  injectMoreContent(elem) {
    const title = this.querySelector('h1').innerHTML;

    if (title) {
      elem.querySelector('[slot="title"]').innerHTML = title;
    }
  }
}

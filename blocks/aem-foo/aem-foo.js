import { Block } from '../../scripts/aem.js';

export default class Foo extends Block {
  constructor() {
    super({ mapValues: true });
    console.log(this.values);
  }
}

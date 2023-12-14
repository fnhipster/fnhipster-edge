export default class Hero extends window.Brick {
  injectMoreContent(elem) {
    const title = this.querySelector('h1').innerHTML;

    if (title) {
      elem.querySelector('[slot="title"]').innerHTML = title;
    }
  }
}

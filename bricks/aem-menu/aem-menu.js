export default class Menu extends Brick {
  path = '/query-index.json';

  async connectedCallback() {
    const list = this.querySelector('#menu');

    const { data } = await Brick.getData('/query-index.json');

    data?.forEach((element) => {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.setAttribute('href', element.path);
      a.textContent = element.title;

      li.appendChild(a);
      list.appendChild(li);
    });
  }
}

export default class Menu extends window.Brick {
  path = '/query-index.json';

  async connectedCallback() {
    const list = this.querySelector('#menu');
    const data = await this.getData();

    data?.forEach((element) => {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.setAttribute('href', element.path);
      a.textContent = element.title;

      li.appendChild(a);
      list.appendChild(li);
    });
  }

  async getData() {
    const initialData = window.Brick.getInitialData(this.path);

    if (initialData) return initialData.data;

    const url = new URL(this.path, window.location.origin);
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
  }
}

import { Brick } from '../../scripts/aem.js';

export default class PageMetadata extends Brick {
  connectedCallback() {
    [...this.children].forEach((child) => {
      const key = child.children[0].textContent.toLowerCase();
      const value = child.children[1].textContent;

      if (key === 'style') {
        value.split(' ').forEach((style) => {
          document.documentElement.classList.add(style);
        });
      } else {
        document.documentElement.setAttribute(`data-${key.replace(' ', '-')}`, value);
      }
    });

    this.innerHTML = '';
  }
}

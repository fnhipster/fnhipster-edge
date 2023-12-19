import { Brick } from '../../scripts/aem.js';

export default class Root extends Brick {
  connectedCallback() {
    const node = this.querySelector('fn-content').shadowRoot;

    // Decorate Sections
    node.querySelectorAll(':scope > div')?.forEach(Root.decorateSection);

    // Decorate Images
    node.querySelectorAll('picture:not([data-decorated])')?.forEach(Root.decorateImage);

    // Decorate Links
    node.querySelectorAll('a:not([data-decorated])')?.forEach(Root.decorateLink);
  }

  static decorateSection(elem) {
    if (elem.dataset.decorated) return;
    elem.classList.add('section');
    elem.dataset.decorated = true;
  }

  static decorateImage(elem) {
    if (elem.dataset.decorated || elem.parentElement.tagName === 'FN-IMAGE') return;

    // wrap element with <fn-image>
    const wrapper = document.createElement('fn-image');
    elem.parentElement.insertBefore(wrapper, elem);
    wrapper.appendChild(elem);

    elem.dataset.decorated = true;
  }

  static decorateLink(elem) {
    const clone = elem.cloneNode(true);

    const fnLink = document.createElement('fn-link');

    if (clone.href) fnLink.setAttribute('href', clone.href);
    if (clone.target) fnLink.setAttribute('target', clone.target);
    if (!clone.href) fnLink.setAttribute('disabled', true);
    fnLink.setAttribute('underlined', true);

    fnLink.innerHTML = elem.innerHTML;

    elem.dataset.decorated = true;

    elem.replaceWith(fnLink);
  }
}

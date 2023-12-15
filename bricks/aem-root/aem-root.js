export default class Root extends window.Brick {
  connectedCallback() {
    const content = this.querySelector('fn-content')?.shadowRoot?.querySelector('main');

    if (!content) return;

    // Decorate Sections
    content.querySelectorAll(':scope > div').forEach((section) => {
      section.classList.add('section');
    });

    // content.querySelectorAll('picture:not([data-decorated])')?.forEach(Root.decorateImage);
    content.querySelectorAll('a:not([data-decorated])')?.forEach(Root.decorateLink);
  }

  // Decorate Images
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

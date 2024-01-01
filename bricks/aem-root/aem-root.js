export default class Root extends window.Brick {
  connectedCallback() {
    const node = this.querySelector('main');

    // Decorate Theme
    Root.decorateTheme();

    // Decorate Sections
    node?.querySelectorAll(':scope > div:not([data-status="loaded"])')?.forEach(Root.decorateSection);

    // Decorate Images
    node?.querySelectorAll('picture:not([data-status="loaded"])')?.forEach(Root.decorateImage);

    // Decorate Links
    node?.querySelectorAll('a:not([data-status="loaded"])')?.forEach(Root.decorateLink);
  }

  static decorateTheme() {
    const color = document.head.querySelector('meta[name="color"]')?.content;
    const background = document.head.querySelector('meta[name="background"]')?.content;

    if (color) document.documentElement.style.setProperty('--color-fg', color);
    if (background) document.documentElement.style.setProperty('--color-bg', background);
  }

  static decorateSection(elem) {
    if (elem.dataset.status) return;

    // remove empty element
    if (!elem.innerHTML) {
      elem.remove();
      return;
    }

    elem.classList.add('section');

    elem.dataset.status = 'loaded';
  }

  static decorateImage(elem) {
    if (elem.dataset.status || elem.parentElement.tagName === 'FN-IMAGE') return;
    // wrap element with <fn-image>
    const wrapper = document.createElement('fn-image');

    elem.parentElement.insertBefore(wrapper, elem);

    wrapper.appendChild(elem);

    elem.dataset.status = 'loaded';
  }

  static decorateLink(elem) {
    const clone = elem.cloneNode(true);
    const fnLink = document.createElement('fn-link');

    if (clone.href) fnLink.setAttribute('href', clone.href);
    if (clone.target) fnLink.setAttribute('target', clone.target);
    if (!clone.href) fnLink.setAttribute('disabled', true);
    fnLink.setAttribute('underlined', true);

    fnLink.innerHTML = elem.innerHTML;

    elem.dataset.status = 'loaded';

    elem.replaceWith(fnLink);
  }
}

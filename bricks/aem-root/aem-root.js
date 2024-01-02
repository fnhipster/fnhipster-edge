export default class Root extends Brick {
  observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const node = mutation.target;

        // Decorate Sections
        node
          ?.querySelectorAll('div:not([data-status="loaded"])')
          ?.forEach(Root.decorateSection);

        // Decorate Images
        node
          ?.querySelectorAll('picture:not([data-status="loaded"])')
          ?.forEach(Root.decorateImage);

        // Decorate Links
        node
          ?.querySelectorAll('a:not([data-status="loaded"])')
          ?.forEach(Root.decorateLink);
      }
    });
  });

  connectedCallback() {
    const node = this.querySelector('fn-content').shadowRoot;

    this.observer.observe(node, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  static decorateSection(elem) {
    if (elem.dataset.status) return;

    // remove empty element
    if (!elem.innerHTML) {
      elem.remove();
      return;
    }

    const fnSection = document.createElement('fn-section');
    fnSection.innerHTML = elem.innerHTML;

    elem.dataset.status = 'loaded';

    [...elem.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-')) {
        fnSection.setAttribute(attr.name.replace('data-', ''), attr.value);
      } else {
        fnSection.setAttribute(attr.name, attr.value);
      }
    });

    elem.replaceWith(fnSection);
  }

  static decorateImage(elem) {
    if (elem.dataset.status || elem.parentElement.tagName === 'FN-IMAGE') {
      return;
    }

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

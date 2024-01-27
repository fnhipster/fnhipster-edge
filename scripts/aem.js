/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const CONFIG = window.AEM_CONFIG || {};

const vBODY = document.body.cloneNode(true);
// const vBODY = new DocumentFragment();
// vBODY.append(...document.body.childNodes);

/**
 * Load HTML Template.
 * @param {string} name The name of the template
 * @returns {Promise<HTMLElement>} The template
 */
async function loadTemplate(name) {
  const href = `/bricks/${name}/${name}.html`;

  return new Promise((resolve, reject) => {
    const id = href.split('/').pop().split('.').shift();

    const brick = vBODY.querySelector(`template[id="${id}"]`);

    if (brick) {
      resolve();
      return;
    }

    fetch(href).then((response) => {
      if (response.ok) {
        response
          .text()
          .then((text) => {
            const container = document.createElement('div');

            container.innerHTML = text.trim();

            const html = container.firstChild;

            if (html) {
              html.id = id;
              vBODY.append(html);
            }
          })
          .finally(resolve);
      } else {
        reject();
      }
    });
  });
}

/**
 * Load Brick.
 * @param {string} name The name of the brick
 * @returns {Promise<HTMLElement>} The brick
 */
async function loadBrick(name) {
  const href = `/bricks/${name}/${name}.js`;

  return new Promise((resolve, reject) => {
    import(href)
      .then((mod) => {
        if (mod.default) {
          resolve({
            name,
            className: mod.default,
          });
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn(`Failed to load module for ${name}`, error);
        reject(error);
      });
  });
}

/**
 * Load a CSS file
 * @param {string} href URL to the CSS file.
 * @returns {Promise<void>} Promise that resolves when the CSS file is loaded
 */
async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (!document.head.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    } else {
      resolve();
    }
  });
}

/**
 * Loads a ES Module file.
 * @param {string} src URL to the JS file
 * @returns {Promise<void>} Promise that resolves when the JS file is loaded
 */
async function loadESModule(src) {
  return new Promise((resolve, reject) => {
    if (!document.head.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    } else {
      resolve();
    }
  });
}

/**
 * Match route.
 * @param {Object} param0 The route
 * @returns {boolean} Whether the route matches the current path
 */
function matchRoute({ route }) {
  return route?.test(window.location.pathname) ?? false;
}

/**
 * Builds hero brick and prepends to main in a new section.
 */
function buildHeroBrick() {
  const main = vBODY.querySelector('main');
  const h1 = main.querySelector('main h1');
  const picture = main.querySelector('main p > picture');

  if (
    h1
    && picture
    // eslint-disable-next-line no-bitwise
    && h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.classList.add('hero');
    section.append(picture.cloneNode(true));
    section.append(h1.cloneNode(true));

    picture.parentElement.remove();
    h1.remove();

    main.prepend(section);
  }
}

/**
 * Decorate root with aem-root.
 */
function decorateRoot() {
  const root = document.createElement('aem-root');
  root.append(vBODY.querySelector('header'));
  root.append(vBODY.querySelector('main'));
  root.append(vBODY.querySelector('footer'));
  vBODY.prepend(root);
}

/**
 * Load first image eagerly.
 */
function loadEagerImages() {
  const pictureElement = vBODY.querySelector('picture');
  pictureElement?.querySelector('img').setAttribute('loading', 'eager');
}

/**
 * Transforms a block into a brick.
 * @param {HTMLElement} block The block to transform
 * @returns {HTMLElement} The brick
 */
function transformToBrick(block) {
  const { classList } = block;
  const blockName = classList[0];

  const tagName = `aem-${blockName || block.tagName.toLowerCase()}`;
  const brick = document.createElement(tagName);
  brick.classList.add(...classList);
  brick.innerHTML = block.innerHTML;
  block.replaceWith(brick);

  return brick;
}

/**
 * Prefetch a URL.
 * @param {string} url The URL to prefetch
 * @returns {Promise<void>} Promise that resolves when the URL is prefetched
 */
async function appendInitialData(path) {
  const url = path.startsWith('/')
    ? new URL(path, window.location.origin)
    : new URL(path);

  try {
    const res = await fetch(url);

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`failed to prefetch "${path}"`);
    }

    const meta = document.createElement('meta');
    meta.setAttribute('property', `data:${path}`);
    meta.setAttribute('content', JSON.stringify(await res.json()));
    document.head.append(meta);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Prefetching "${path}" failed:`, error);
  }
}

/**
 * Load Bricks.
 * @param {boolean} lazy Whether to load lazy bricks
 * @returns {Promise<void>
 */
function loadBricks(lazy = false) {
  return async () => {
    const components = [];
    const templates = [];
    const result = [];

    CONFIG.bricks
      ?.filter(matchRoute)
      .forEach(({
        name, selector, template, lazy: _lazy = false,
      }) => {
        if (lazy !== _lazy) return;

        components.push(name);

        result.push({
          name,
          selector,
          template,
          lazy,
        });

        if (template) templates.push(name);

        // Load Bricks from DOM
        vBODY.querySelectorAll(selector).forEach((block) => {
          const { status } = block.dataset;

          if (status === 'loading' || status === 'loaded') return;

          block.dataset.status = 'loading';

          const brick = transformToBrick(block);

          brick.dataset.status = 'loaded';
        });
      });

    const [loaded] = await Promise.allSettled([
      Promise.allSettled([...components].map(loadBrick)),
      Promise.allSettled([...templates].map(loadTemplate)),
    ]);

    loaded.value.forEach(({ status, value }) => {
      if (status === 'fulfilled') {
        // If not already defined, define it.
        if (!customElements.get(value.name)) {
          customElements.define(value.name, value.className);
        }
      }
    });

    return result;
  };
}

/**
 * Load ES Modules.
 * @param {boolean} lazy Whether to load lazy modules
 * @returns {Promise<void>
 */
function loadESModules(lazy = false) {
  return async () => {
    const modules = CONFIG.modules
      ?.filter(matchRoute)
      .filter(({ lazy: _lazy = false }) => lazy === _lazy)
      .map(({ path }) => path);

    return Promise.allSettled([...modules].map(loadESModule));
  };
}

/**
 * Load Styles.
 * @param {boolean} lazy Whether to load lazy styles
 * @returns {Promise<void>
 */
function loadStyles(lazy = false) {
  return async () => {
    const styles = CONFIG.styles
      ?.filter(matchRoute)
      .filter(({ lazy: _lazy = false }) => lazy === _lazy)
      .map(({ path }) => path);

    return Promise.allSettled([...styles].map(loadCSS));
  };
}

/**
 * Load Initial Data.
 * @param {HTMLElement} element The fragment element
 * @returns {Promise<void>} Promise that resolves when the fragment is loaded
 */
async function loadInitialData() {
  const prefetches = CONFIG.initialData
    ?.filter(matchRoute)
    .map(({ path }) => path);

  return Promise.allSettled([...prefetches].map(appendInitialData));
}

/**
 * Wait for LCP.
 * @returns {Promise<PerformanceEntry>} Promise that resolves when the LCP is loaded
 */
function waitForLCP() {
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          resolve(entry);
          observer.disconnect();
        }
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

/**
 * Initialize.
 * @param {Object} config The config
 * @returns {Promise<void>} Promise that resolves when the page is initialized
 */
async function initialize() {
  // Load first image eagerly
  loadEagerImages();

  // Build hero brick
  buildHeroBrick();

  // Decorate Root
  decorateRoot();

  // Load Resources
  await Promise.allSettled([
    loadBricks(false)(),
    loadESModules(false)(),
    loadStyles(false)(),
    loadInitialData(),
  ]);

  // update body
  document.body.dataset.status = 'loaded';
  document.body.innerHTML = vBODY.innerHTML;

  // Load Lazy Resources
  setTimeout(async () => {
    const [lazyBricksLoaded] = await Promise.allSettled([
      loadBricks(true)(),
      loadESModules(true)(),
      loadStyles(true)(),
    ]);

    // rehydrate lazy bricks in body
    if (lazyBricksLoaded.status === 'fulfilled') {
      lazyBricksLoaded.value.forEach(({ name, selector, template }) => {
        if (template) {
          document.body.append(vBODY.querySelector(`#${name}`));
        }

        const destination = document.body.querySelector(selector);
        const source = vBODY.querySelector(name);
        destination.replaceWith(source);
      });
    }
  }, 0);
}

/**
 * Simpler brick using aem-append attributes in the
 * HTML template to select the content to inject in it.
 */
window.Brick = class Brick extends HTMLElement {
  static appendFromCSSSelector(scope, elem) {
    scope.querySelectorAll('*[aem-append]')?.forEach((selector) => {
      const attr = selector.getAttribute('aem-append');

      elem.querySelectorAll(attr).forEach((item) => {
        const src = item.cloneNode(true);

        if (src) {
          selector.append(src);
        }
      });

      // remove the attribute so we don't try to inject it again
      selector.removeAttribute('aem-append');
    });
  }

  static repeatFromCSSSelector(scope, elem) {
    scope.querySelectorAll('*[aem-repeat]').forEach((each) => {
      const parent = each.parentNode;

      elem.querySelectorAll(each.getAttribute('aem-repeat')).forEach((item) => {
        const clone = each.cloneNode(true);

        each.remove();

        // add item attributes
        [...clone.attributes].forEach((attr) => {
          item.setAttribute(attr.name, attr.value);
        });

        // replace content from our template's CSS selectors
        clone.replaceWith(item);

        // remove the attribute so we don't try to inject it again
        item.removeAttribute('aem-repeat');

        parent.append(item);
      });
    });
  }

  static eachFromCSSSelector(scope, elem) {
    scope.querySelectorAll('*[aem-each]').forEach((each) => {
      const parent = each.parentNode;

      elem.querySelectorAll(each.getAttribute('aem-each')).forEach((item) => {
        const clone = each.cloneNode(true);

        each.remove();

        // Inject content from our template's CSS selectors
        Brick.appendFromCSSSelector(clone, item);

        // Each content from interations from our template's CSS selectors
        Brick.eachFromCSSSelector(clone, item);

        // remove the attribute so we don't try to inject it again
        clone.removeAttribute('aem-each');

        parent.append(clone);
      });
    });
  }

  static async getData(path) {
    const meta = document.head.querySelector(`meta[property="data:${path}"]`);

    if (meta) {
      return JSON.parse(meta.getAttribute('content'));
    }

    const url = path.startsWith('/')
      ? new URL(path, window.location.origin)
      : new URL(path);

    const res = await fetch(url);

    return res.json();
  }

  constructor() {
    super();

    const id = this.tagName.toLowerCase();

    const template = document.getElementById(id);

    if (template) {
      const newContent = template.content.cloneNode(true);

      // Repeat content from interations from our template's CSS selectors
      Brick.repeatFromCSSSelector(newContent, this);

      // Each content from interations from our template's CSS selectors
      Brick.eachFromCSSSelector(newContent, this);

      // Append content from our template's CSS selectors
      Brick.appendFromCSSSelector(newContent, this);

      this.innerHTML = '';
      this.appendChild(newContent);
    }
  }
};

initialize();

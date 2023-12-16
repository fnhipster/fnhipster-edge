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

/**
 * Load HTML Template.
 * @param {string} name The name of the template
 * @returns {Promise<HTMLElement>} The template
 */
async function loadTemplate(name) {
  const href = `/bricks/${name}/${name}.html`;

  return new Promise((resolve, reject) => {
    const id = href.split('/').pop().split('.').shift();

    const brick = document.querySelector(`template[id="${id}"]`);

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
              document.body.append(html);
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
    if (!document.querySelector(`head > link[href="${href}"]`)) {
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
 * Loads a non module JS file.
 * @param {string} src URL to the JS file
 * @returns {Promise<void>} Promise that resolves when the JS file is loaded
 */
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > script[src="${src}"]`)) {
      const script = document.createElement('script');
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
 * Loads a ES Module file.
 * @param {string} src URL to the JS file
 * @returns {Promise<void>} Promise that resolves when the JS file is loaded
 */
async function loadESModule(src) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > script[src="${src}"]`)) {
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
 * Builds hero brick and prepends to main in a new section.
 */
function buildHeroBrick() {
  const main = document.querySelector('main');
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
  root.append(document.querySelector('header'));
  root.append(document.querySelector('main'));
  root.append(document.querySelector('footer'));
  document.body.prepend(root);
}

/**
 * Load first image eagerly.
 */
function loadEagerImages() {
  const pictureElement = document.querySelector('picture');
  pictureElement.querySelector('img').setAttribute('loading', 'eager');
}

/**
 * Transforms a block into a brick.
 * @param {HTMLElement} block The block to transform
 * @returns {HTMLElement} The brick
 */
function transformToBrick(block) {
  const { classList } = block;
  const blockName = classList[0];
  const blockClasses = [...classList].slice(1);

  const tagName = `aem-${blockName || block.tagName.toLowerCase()}`;
  const brick = document.createElement(tagName);
  brick.classList.add(...blockClasses);

  brick.innerHTML = block.innerHTML;

  block.parentNode.replaceChild(brick, block);

  return brick;
}

/**
 * Get brick resources.
 * @returns {Object} The brick resources
 */
function getBrickResources() {
  const components = new Set(['aem-root']);
  const templates = new Set(['aem-root']);

  // Load Bricks from DOM
  document.body
    .querySelectorAll('div[class]:not(.fragment)')
    .forEach((block) => {
      const { status } = block.dataset;

      if (status === 'loading' || status === 'loaded') return;

      block.dataset.status = 'loading';

      const brick = transformToBrick(block);
      const tagName = brick.tagName.toLowerCase();

      components.add(tagName);

      // only add templates for non-metadata bricks
      if (!tagName.endsWith('-metadata')) {
        templates.add(tagName);
      }

      brick.dataset.status = 'loaded';
    });

  return { components, templates };
}

/**
 * Preload fragment.
 * @param {HTMLElement} element The fragment element
 * @returns {Promise<void>} Promise that resolves when the fragment is loaded
 */
async function preloadFragment(element) {
  const item = element.querySelector('div > div');
  const path = item.innerText;

  const url = new URL(`${path}.plain.html`, window.location.origin);

  try {
    const res = await fetch(url);

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`failed to preload fragment ${path}`);
    }

    item.innerHTML = await res.text();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Loading fragment ${path} failed:`, error);
  }
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
export default async function initialize(config = {}) {
  // Load first image eagerly
  loadEagerImages();

  // Build hero brick
  buildHeroBrick();

  // Decorate Root
  decorateRoot();

  // Preload fragments
  await Promise.allSettled(
    [...document.querySelectorAll('.fragment')].map(preloadFragment),
  );

  // Load brick resources
  const { components, templates } = getBrickResources();

  const [loadedComponents] = await Promise.allSettled([
    // bricks in the document
    Promise.allSettled([...components].map(loadBrick)),
    Promise.allSettled([...templates].map(loadTemplate)),

    // eager modules
    Promise.allSettled(
      config.modules
        ?.filter(matchRoute)
        .filter(({ lazy }) => !lazy)
        .map(({ path }) => loadESModule(path)) || [],
    ),

    // eager scripts
    Promise.allSettled(
      config.modules
        ?.filter(matchRoute)
        .filter(({ lazy }) => !lazy)
        .map(({ path }) => loadScript(path)) || [],
    ),

    // eager styles
    Promise.allSettled(
      config.styles
        ?.filter(matchRoute)
        .filter(({ lazy }) => !lazy)
        .map(({ path }) => loadCSS(path)) || [],
    ),
  ]);

  // Define custom elements
  loadedComponents.value.forEach(async ({ status, value }) => {
    if (status === 'fulfilled') {
      // If not already defined, define it.
      if (!customElements.get(value.name)) {
        customElements.define(value.name, value.className);
      }
    }
  });

  // Page is fully loaded
  document.body.dataset.status = 'loaded';

  // Wait for LCP
  await waitForLCP();

  // Load lazy scripts
  config.modules
    ?.filter(matchRoute)
    .filter(({ lazy }) => lazy)
    .forEach(({ path }) => {
      loadESModule(`${path}`);
    });

  // Load lazy scripts
  config.scripts
    ?.filter(matchRoute)
    .filter(({ lazy }) => lazy)
    .forEach(({ path }) => {
      loadScript(`${path}`);
    });

  // Load lazy styles
  config.styles
    ?.filter(matchRoute)
    .filter(({ lazy }) => lazy)
    .forEach(({ path }) => {
      loadCSS(`${path}`);
    });
}

/**
 * Simpler brick using aem-append attributes in the
 * HTML template to select the content to inject in it.
 */
export class Brick extends HTMLElement {
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

      // Let derived classes inject more content if needed
      if (typeof this.injectMoreContent === 'function') {
        this.injectMoreContent(newContent);
      }

      // Append content to shadow root or directly
      if (template.getAttribute('shadowroot') === 'true') {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(newContent);
        this.root = this.shadowRoot;
      } else {
        this.innerHTML = '';
        this.append(newContent);
        this.root = this;
      }
    }
  }
}

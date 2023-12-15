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
  const href = `${window.hlx.codeBasePath}/bricks/${name}/${name}.html`;

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
  const href = `${window.hlx.codeBasePath}/bricks/${name}/${name}.js`;

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
 * log RUM if part of the sample.
 * @param {string} checkpoint identifies the checkpoint in funnel
 * @param {Object} data additional data for RUM sample
 * @param {string} data.source DOM node that is the source of a checkpoint event,
 * identified by #id or .classname
 * @param {string} data.target subject of the checkpoint event,
 * for instance the href of a link, or a search term
 */
export function sampleRUM(checkpoint, data = {}) {
  sampleRUM.defer = sampleRUM.defer || [];
  const defer = (fnname) => {
    sampleRUM[fnname] = sampleRUM[fnname]
      || ((...args) => sampleRUM.defer.push({ fnname, args }));
  };
  sampleRUM.drain = sampleRUM.drain
    || ((dfnname, fn) => {
      sampleRUM[dfnname] = fn;
      sampleRUM.defer
        .filter(({ fnname }) => dfnname === fnname)
        .forEach(({ fnname, args }) => sampleRUM[fnname](...args));
    });
  sampleRUM.always = sampleRUM.always || [];
  sampleRUM.always.on = (chkpnt, fn) => {
    sampleRUM.always[chkpnt] = fn;
  };
  sampleRUM.on = (chkpnt, fn) => {
    sampleRUM.cases[chkpnt] = fn;
  };
  defer('observe');
  defer('cwv');
  try {
    window.hlx = window.hlx || {};
    if (!window.hlx.rum) {
      const usp = new URLSearchParams(window.location.search);
      const weight = usp.get('rum') === 'on' ? 1 : 100; // with parameter, weight is 1. Defaults to 100.
      const id = Array.from({ length: 75 }, (_, i) => String.fromCharCode(48 + i))
        .filter((a) => /\d|[A-Z]/i.test(a))
        .filter(() => Math.random() * 75 > 70)
        .join('');
      const random = Math.random();
      const isSelected = random * weight < 1;
      const firstReadTime = Date.now();
      const urlSanitizers = {
        full: () => window.location.href,
        origin: () => window.location.origin,
        path: () => window.location.href.replace(/\?.*$/, ''),
      };
      // eslint-disable-next-line object-curly-newline, max-len
      window.hlx.rum = {
        weight,
        id,
        random,
        isSelected,
        firstReadTime,
        sampleRUM,
        sanitizeURL: urlSanitizers[window.hlx.RUM_MASK_URL || 'path'],
      };
    }
    const { weight, id, firstReadTime } = window.hlx.rum;
    if (window.hlx && window.hlx.rum && window.hlx.rum.isSelected) {
      const knownProperties = [
        'weight',
        'id',
        'referer',
        'checkpoint',
        't',
        'source',
        'target',
        'cwv',
        'CLS',
        'FID',
        'LCP',
        'INP',
      ];
      const sendPing = (pdata = data) => {
        // eslint-disable-next-line object-curly-newline, max-len, no-use-before-define
        const body = JSON.stringify(
          {
            weight,
            id,
            referer: window.hlx.rum.sanitizeURL(),
            checkpoint,
            t: Date.now() - firstReadTime,
            ...data,
          },
          knownProperties,
        );
        const url = `https://rum.hlx.page/.rum/${weight}`;
        // eslint-disable-next-line no-unused-expressions
        navigator.sendBeacon(url, body);
        // eslint-disable-next-line no-console
        console.debug(`ping:${checkpoint}`, pdata);
      };
      sampleRUM.cases = sampleRUM.cases || {
        cwv: () => sampleRUM.cwv(data) || true,
        lazy: () => {
          // use classic script to avoid CORS issues
          const script = document.createElement('script');
          script.src = 'https://rum.hlx.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js';
          document.head.appendChild(script);
          return true;
        },
      };
      sendPing(data);
      if (sampleRUM.cases[checkpoint]) {
        sampleRUM.cases[checkpoint]();
      }
    }
    if (sampleRUM.always[checkpoint]) {
      sampleRUM.always[checkpoint](data);
    }
  } catch (error) {
    // something went wrong
  }
}

/**
 * Setup brick utils.
 */
function setup() {
  window.hlx = window.hlx || {};
  window.hlx.RUM_MASK_URL = 'full';
  window.hlx.codeBasePath = '';
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';
}

/**
 * Load first image eagerly.
 */
function loadEagerImages() {
  // Query for the first <picture> element in the DOM
  const pictureElement = document.querySelector('picture');

  pictureElement.querySelector('img').setAttribute('loading', 'eager');

  // if (!pictureElement) return;

  // function getSrcSet() {
  //   const sourceElement = Array.from(
  //     pictureElement.querySelectorAll('source'),
  //   ).find((source) => {
  //     const mediaQuery = source.getAttribute('media');
  //     return !mediaQuery || window.matchMedia(mediaQuery).matches;
  //   });

  //   const source = (sourceElement && sourceElement.getAttribute('srcset'))
  //     || pictureElement.querySelector('img').getAttribute('src');

  //   return source;
  // }

  // // Create the link element
  // const linkElement = document.createElement('link');
  // linkElement.rel = 'preload';
  // linkElement.as = 'image';
  // linkElement.href = getSrcSet();

  // // Append the link element to the head of the document
  // document.head.appendChild(linkElement);
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
 * Initialize.
 * @param {Object} config The config
 * @returns {Promise<void>} Promise that resolves when the page is initialized
 */
export default async function initialize(config = {}) {
  // Hide page until fully loaded
  document.body.style.display = 'none';

  // Setup
  setup();

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

  // TODO: abstract this into a function
  const [loadedComponents] = await Promise.allSettled([
    // bricks in the document
    Promise.allSettled([...components].map(loadBrick)),
    Promise.allSettled([...templates].map(loadTemplate)),

    // eager modules
    Promise.allSettled(
      config.modules
        ?.filter(matchRoute)
        .filter((s) => s.eager)
        .map(({ path }) => loadESModule(`${window.hlx.codeBasePath}${path}`)) || [],
    ),

    // eager scripts
    Promise.allSettled(
      config.modules
        ?.filter(matchRoute)
        .filter((s) => s.eager)
        .map(({ path }) => loadScript(`${window.hlx.codeBasePath}${path}`)) || [],
    ),

    // eager styles
    Promise.allSettled(
      config.styles
        ?.filter(matchRoute)
        .filter((s) => s.eager)
        .map(({ path }) => loadCSS(`${window.hlx.codeBasePath}${path}`)) || [],
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
  document.body.style.removeProperty('display');

  // rest of EDS setup...
  sampleRUM('top');

  window.addEventListener('load', () => sampleRUM('load'));

  window.addEventListener('unhandledrejection', (event) => {
    sampleRUM('error', {
      source: event.reason.sourceURL,
      target: event.reason.line,
    });
  });

  window.addEventListener('error', (event) => {
    sampleRUM('error', { source: event.filename, target: event.lineno });
  });

  // Load lazy scripts
  config.modules
    ?.filter(matchRoute)
    .filter((s) => !s.eager)
    .forEach(({ path }) => {
      loadESModule(`${window.hlx.codeBasePath}${path}`);
    });

  // Load lazy scripts
  config.scripts
    ?.filter(matchRoute)
    .filter((s) => !s.eager)
    .forEach(({ path }) => {
      loadScript(`${window.hlx.codeBasePath}${path}`);
    });

  // Load lazy styles
  config.styles
    ?.filter(matchRoute)
    .filter((s) => !s.eager)
    .forEach(({ path }) => {
      loadCSS(`${window.hlx.codeBasePath}${path}`);
    });
}

/**
 * Simpler brick using aem-inject attributes in the
 * HTML template to select the content to inject in it.
 */
window.Brick = class Brick extends HTMLElement {
  // TODO: Template Methods
  // - aem-repeat
  // - aem-append
  // - aem-replace-with
  static injectFromCSSSelector(scope, elem) {
    scope.querySelectorAll('*[aem-inject]')?.forEach((selector) => {
      const attr = selector.getAttribute('aem-inject');

      if (attr === '') {
        selector.append(elem.cloneNode(true));
      } else {
        elem.querySelectorAll(attr).forEach((item) => {
          const src = item.cloneNode(true);

          if (src) {
          // set loaded attribute
            selector.append(src);
          }
        });
      }

      // remove the attribute so we don't try to inject it again
      selector.removeAttribute('aem-inject');
    });
  }

  static injectEachLoopFromCSSSelector(scope, elem) {
    scope.querySelectorAll('*[aem-each]').forEach((each) => {
      const parent = each.parentNode;

      elem.querySelectorAll(each.getAttribute('aem-each')).forEach((item) => {
        const clone = each.cloneNode(true);
        const selfInjected = clone.getAttribute('aem-each-inject');

        each.remove();

        // Inject content from our template's CSS selectors
        Brick.injectFromCSSSelector(clone, item);

        // inject content
        if (typeof selfInjected !== 'undefined') {
          if (selfInjected === '') {
            clone.append(item.cloneNode(true));
          } else {
            item.querySelectorAll(selfInjected).forEach((self) => {
              clone.append(self.cloneNode(true));
            });
          }

          // remove the attribute so we don't try to inject it again
          clone.removeAttribute('aem-each-inject');
        }

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

      // Inject content from interations from our template's CSS selectors
      Brick.injectEachLoopFromCSSSelector(newContent, this);

      // Inject content from our template's CSS selectors
      Brick.injectFromCSSSelector(newContent, this);

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
};

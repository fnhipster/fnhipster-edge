/**
 * Load HTML Template
 * @param {string} name The name of the template
 * @returns {Promise<HTMLTemplateElement>} The template
 */
async function loadTemplate(element) {
  const blockName = element.tagName.toLowerCase();
  const href = `/blocks/${blockName}/${blockName}.html`;

  return new Promise((resolve, reject) => {
    const id = href.split('/').pop().split('.').shift();

    if (!document.querySelector(`body > template[id="${id}"]`)) {
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
    } else {
      resolve();
    }
  });
}

/**
 * Load Block
 * @param {string} href The path to the block
 * @returns {Promise<HTMLElement>} The block
 */
async function loadBlock(element) {
  const blockName = element.tagName.toLowerCase();

  const href = `/blocks/${blockName}/${blockName}.js`;

  return new Promise((resolve) => {
    import(href)
      .then((mod) => {
        if (mod.default) {
          resolve({
            name: blockName,
            className: mod.default,
          });
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`failed to load module for ${blockName}`, error);
      })
      .finally(resolve);
  });
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
function sampleRUM(checkpoint, data = {}) {
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
 * Setup block utils.
 */
function setup() {
  window.hlx = window.hlx || {};
  window.hlx.RUM_MASK_URL = 'full';
  window.hlx.codeBasePath = '';
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';

  const scriptEl = document.querySelector('script[src$="/scripts/scripts.js"]');
  if (scriptEl) {
    try {
      [window.hlx.codeBasePath] = new URL(scriptEl.src).pathname.split(
        '/scripts/scripts.js',
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

/** Eager load first image */
function eagerLoadFirstImage() {
  const images = document.querySelectorAll('img');

  images.forEach((img) => {
    // on load, eager load if image is majorly visible in the viewport
    const visible = img.getBoundingClientRect().top < (window.innerHeight / 1.5);

    if (visible) {
      img.setAttribute('loading', 'eager');
    }
  });
}

function transformToCustomElement(block) {
  const tagName = `aem-${block.getAttribute('class') || block.tagName.toLowerCase()}`;
  const customElement = document.createElement(tagName);

  customElement.innerHTML = block.innerHTML;

  block.parentNode.replaceChild(customElement, block);

  // Slots
  [...customElement.children].forEach((slot) => {
    slot.setAttribute('slot', 'item');
  });

  return customElement;
}

function getBlockResources() {
  const components = new Set();
  const templates = new Set();
  const fragments = new Set();

  document.querySelectorAll('header, footer, div[class]').forEach((block) => {
    const customElement = transformToCustomElement(block);
    const tagName = customElement.tagName.toLowerCase();

    components.add(customElement);

    // fragments to preload
    if (block.classList.contains('fragment')) {
      fragments.add(customElement);
    }

    // only add templates for non-metadata blocks
    if (!tagName.endsWith('-metadata')) {
      templates.add(customElement);
    }
  });

  return { components, templates, fragments };
}

async function preloadFragment(element) {
  const slot = element.querySelector('[slot="item"]');
  const path = element.querySelector('[slot="item"] > div').textContent;
  slot.innerHTML = '';

  const url = new URL(`${path}.plain.html`, window.location.origin);

  try {
    const res = await fetch(url);

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`failed to preload fragment ${path}`);
    }

    const content = await res.text();
    slot.innerHTML = content;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Loading fragment ${path} failed:`, error);
  }
}

/**
 * Initializiation.
 */
export default async function initialize() {
  // Eager load first image
  eagerLoadFirstImage();

  // Load block resources
  const { components, templates, fragments } = getBlockResources();

  await Promise.allSettled([...fragments].map(preloadFragment));

  const [, loadedComponents] = await Promise.allSettled([
    Promise.allSettled([...templates].map(loadTemplate)),
    Promise.allSettled([...components].map(loadBlock)),
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

  // rest of EDS setup...
  setup();
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
}

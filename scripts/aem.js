/**
 * Load HTML Template
 * @param {string} name The name of the template
 * @returns {Promise<HTMLTemplateElement>} The template
 */
async function loadTemplate(blockName) {
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
async function loadBlock(blockName) {
  const href = `/blocks/${blockName}/${blockName}.js`;

  return new Promise((resolve) => {
    import(href)
      .then((mod) => {
        if (mod.default) {
          resolve({
            type: 'webcomponent',
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
  const img = document.querySelector('img');

  if (img) {
    img.setAttribute('loading', 'eager');
  }
}

/**
 * Auto initializiation.
 */
export default async function initialize() {
  eagerLoadFirstImage();

  const fragments = [];
  const definitions = [];

  document.querySelectorAll('.aem-block').forEach(async (block) => {
    const status = block.dataset.blockStatus;

    if (status !== 'loading' && status !== 'loaded') {
      block.dataset.blockStatus = 'loading';

      const blockName = block.tagName.toLowerCase();

      // Prefetches
      if (blockName === 'aem-fragment') {
        fragments.push(block);
      }

      // All Blocks
      definitions.push(['block', blockName]);

      // Non-metadata blocks assets
      if (!blockName.endsWith('-metadata')) {
        definitions.push(['template', blockName]);
      }

      block.dataset.blockStatus = 'loaded';
    }
  });

  // TODO: it's not picking up Blocks inside the Fragment
  // might need rerun after Fragment is loaded
  await Promise.allSettled([
    ...fragments.map(async (fragment) => {
      const slot = fragment.querySelector('[slot="item"]');

      const path = slot.innerText.trim();

      const url = new URL(`${path}.plain.html`, window.location.origin);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          // eslint-disable-next-line no-console
          console.warn(`Fragment ${path} not found.`);
        }

        const html = await response.text();

        slot.innerHTML = html;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Loading fragment "${path}" failed:`, error);
      }
    }),
  ]);

  // Settle all imports and define custom elements
  await Promise.allSettled([
    ...definitions.map(([type, name]) => (type === 'block' ? loadBlock(name) : loadTemplate(name))),
  ]).then((settled) => {
    settled.forEach(async ({ status, value }) => {
      if (status === 'fulfilled') {
        if (value?.type === 'webcomponent' && !customElements.get(value.name)) {
          customElements.define(value.name, value.className);
        }
      }
    });

    document.body.dataset.status = 'loaded';
  });

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

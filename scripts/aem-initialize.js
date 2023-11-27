/**
 * Loads a CSS file.
 * @param {string} href URL to the CSS file
 * @returns {Promise<void>} Promise that resolves when the CSS file is loaded
 */
function loadCSS(blockName) {
  const href = `/blocks/${blockName}/${blockName}.css`;

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
          // Define custom element if not already defined
          if (!customElements.get(blockName)) {
            customElements.define(blockName, mod.default);
          }
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`failed to load module for ${blockName}`, error);
      });

    resolve();
  });
}

/**
 * Initialize Blocks
 */
const styles = [];
const templates = [];
const blocks = [];

document.querySelectorAll('.aem-block').forEach(async (block) => {
  const status = block.dataset.blockStatus;

  if (status !== 'loading' && status !== 'loaded') {
    block.dataset.blockStatus = 'loading';

    const blockName = block.tagName.toLowerCase();

    // All Bloacks
    blocks.push(blockName);

    // Non-metadata blocks assets
    if (!blockName.endsWith('-metadata')) {
      styles.push(blockName);
      templates.push(blockName);
    }

    block.dataset.blockStatus = 'loaded';
  }
});

// Block Assets
await Promise.all([
  ...styles.map((blockName) => loadCSS(blockName)),
  ...templates.map((blockName) => loadTemplate(blockName)),
]);

await Promise.all(blocks.map((blockName) => loadBlock(blockName)));

document.body.dataset.status = 'loaded';

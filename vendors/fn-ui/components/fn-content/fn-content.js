const tagName = 'fn-content';

const template = document.createElement('template');

const style = document.createElement('style');

style.innerHTML = /* css */ `
  fn-content {
    font: var(--font);
    color: var(--color-fg);
  }

  fn-content strong {
    font-weight: var(--font-bold);
    text-shadow: 0 0 0.2rem currentColor;
  }

  fn-content h1,
  fn-content h2,
  fn-content h3 {
    font: var(--font-heading);
    text-transform: uppercase;
    margin: var(--spacing-md) 0;
    word-spacing: -0.25em;
  }

  fn-content h1 {
    font-size: var(--font-heading-xl);
  }

  fn-content h2 {
    font-size: var(--font-heading-lg);
  }

  fn-content h3 {
    font-size: var(--font-heading-md);
  }

  fn-content p {
    margin: var(--spacing-md) 0;
  }

  fn-content img,
  fn-content video,
  fn-content iframe {
    max-inline-size: 100%;
    block-size: auto;
  }

  fn-content hr {
    border-color: var(--color-fg);
    border-style: solid;
    border-width: 0.3rem;
    max-width: 20rem;
    display: inline-block;
    width: 100%;
    margin: var(--spacing-md) 0;
  }

  fn-content blockquote {
    font-size: 1.2em;
    line-height: 1.3;
    font-style: italic;
    margin: 0;
    padding: var(--spacing-md);
    border-left: 0.5em solid;
  }
`;

document.head.appendChild(style);

template.innerHTML = /* html */ `
  <slot></slot>
`;

export default class Content extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Content);

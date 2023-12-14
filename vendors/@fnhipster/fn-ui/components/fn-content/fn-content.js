const tagName = 'fn-content';

export default class Content extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          font-family: var(--typography-body);
          font-size: 1.8rem;
          line-height: 1.5;
        }

        strong {
          font-weight: 600;
          text-shadow: 0 0 0.2rem currentColor;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(--typography-heading);
          margin: var(--spacing-lg) 0;
          text-transform: uppercase;
        }

        h1 {
          font-size: 4rem;
        }

        h2 {
          font-size: 2.9rem;
        }

        h3 {
          font-size: 2.8rem;
        }

        h4 {
          font-size: 2.7rem;
        }

        h5 {
          font-size: 2.6rem;
        }

        h6 {
          font-size: 2.5rem;
        }

        p {
          margin: var(--spacing-md) 0;
        }

        img,
        video,
        iframe {
          max-inline-size: 100%;
          block-size: auto;
        }

        hr {
          border-color: var(--color-fg);
          border-style: solid;
          border-width: 0.3rem;
          max-width: 20rem;
          display: inline-block;
          width: 100%;
          margin: var(--spacing-md) 0;
        }

        blockquote {
          font-size: 1.2em;
          line-height: 1.3;
          font-style: italic;
          margin: 0;
          padding: var(--spacing-md);
          border-left: 0.5em solid;
        }
      </style>
    `;
  }

  connectedCallback() {
    [...this.children]?.forEach((child) => {
      this.shadowRoot.appendChild(child);
    });
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Content);

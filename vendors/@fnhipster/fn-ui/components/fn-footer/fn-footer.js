import '../fn-binary/fn-binary.js';

const tagName = 'fn-footer';

export default class Footer extends HTMLElement {
  static get observedAttributes() {
    return ['message'];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = /* html */ `
      <style>
          footer {
            align-items: center;
            display: flex;
            font-family: var(--typography-accent);
            font-size: 1.8rem;
            justify-content: space-between;
            text-transform: uppercase;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm) 0;
          }

          @media (width >= 650px) {
            footer {
              padding: var(--spacing-md) 0;
            }
          }
      </style>
        
      <footer className="fnh-footer">
        <fn-binary></fn-binary>
        <span>© ${new Date().getUTCFullYear()}, fnhipster</span>
      </footer>
    `;
  }

  attributeChangedCallback(name, prev, next) {
    if (prev === next) return;

    switch (name) {
      case 'message':
        this.renderMessage(next);
        break;

      default:
        break;
    }
  }

  renderMessage(message) {
    const element = this.shadowRoot.querySelector('fn-binary');
    element.innerHTML = message;
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Footer);

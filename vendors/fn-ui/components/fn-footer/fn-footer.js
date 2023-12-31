const tagName = 'fn-footer';

const template = document.createElement('template');

template.innerHTML = /* html */ `
  <style>
      footer {
        align-items: center;
        display: flex;
        font: var(--font-accent);
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

export default class Footer extends HTMLElement {
  static get observedAttributes() {
    return ['message'];
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));
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
    element.setAttribute('message', message);
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Footer);

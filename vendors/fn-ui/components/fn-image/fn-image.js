const tagName = 'fn-image';

export default class Image extends HTMLElement {
  initialized = false;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          background: currentColor;
          display: inline-block;
          line-height: 0;
        }

        .wrapper {
          position: relative;
          display: inline-block;
          opacity: 0;
          transition: opacity 100ms ease-in-out;
        }

        .glow {
          filter: blur(15px);
          opacity: 0.75;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: -1;
        }

        .glow img {
          width: 100%;
          height: 100%;
        }
      </style>
      
      <div class="wrapper">
          <slot></slot>    
      </div>
    `;
  }

  mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target === this) {
        this.initialize();
      }
    });
  });

  connectedCallback() {
    this.initialize();

    // observe changes to innerHTML
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true,
    });
  }

  initialize() {
    if (this.initialized) return;

    console.log('Image initialized', this.getAttribute('src'));

    const wrapper = this.shadowRoot.querySelector('.wrapper');
    const child = this.querySelector(':scope > img, :scope > picture');
    const img = this.querySelector('img');

    if (!img) return;

    // glow effect
    const glow = child.cloneNode(true);
    glow.classList.add('glow');
    glow.setAttribute('aria-hidden', 'true');
    wrapper.append(glow);

    img.addEventListener('load', () => {
      wrapper.style.opacity = 1;
      this.initialized = true;
    });
  }

  disconnectedCallback() {
    this.mutationObserver.disconnect();
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Image);

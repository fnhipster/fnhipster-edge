const tagName = 'fn-app';

const template = document.createElement('template');

template.innerHTML = /* html */ `
  <style>
      :host {
        animation: glitch 0.5s linear;  
        box-sizing: border-box;
        display: grid; 
        font-size: 10px;
        grid-auto-rows: auto 1fr auto;  
        min-height: 100vh; 
        padding: 0 var(--margin); 
        transform-origin: top center; 
        width: 100%;
        color: var(--color-fg);
        max-width: 1200px; 
        margin: 0 auto; 
      }

      @keyframes glitch {          
        /* Glitch */
        0%,
        40%,
        44%,
        58%,
        61%,
        65%,
        69%,
        73%,
        100% {
          transform: skewX(0deg);
        }
        41% {
          transform: skewX(1deg);
        }
        42% {
          transform: skewX(-1deg);
        }
        59% {
          transform: skewX(3.5deg) skewY(1deg);
        }
        60% {
          transform: skewX(-3.5deg) skewY(-1deg);
        }
        63% {
          transform: skewX(1deg) skewY(-0.5deg);
        }
        70% {
          transform: skewX(-3deg) skewY(-2deg);
        }
        71% {
          transform: skewX(1deg) skewY(-1deg);
        }
      }
  </style>

  <slot name="header"></slot>
  <slot name="main"></slot>
  <slot name="footer"></slot>
`;

export default class App extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, App);

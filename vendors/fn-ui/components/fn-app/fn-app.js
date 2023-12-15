import '../fn-header/fn-header.js';
import '../fn-content/fn-content.js';
import '../fn-footer/fn-footer.js';

const tagName = 'fn-app';

export default class App extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = /* html */ `
      <style>
          :host {
            box-sizing: border-box;
            display: grid; 
            font-size: 10px;
            grid-auto-rows: auto 1fr auto;  
            margin: 0 auto; 
            max-width: 100rem; 
            min-height: 100vh; 
            padding: 0 var(--margin); 
            transform-origin: top center; 
            width: 100%; 
          }
      </style>

      <slot name="header"></slot>
      <slot name="main"></slot>
      <slot name="footer"></slot>
    `;
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, App);

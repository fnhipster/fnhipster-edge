const tagName = 'fn-logo';

export default class Logo extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          display: flex;
          align-items: center;
        }
        
        svg {
          height: 1em;
        }
      </style>
      
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.23 7.81">
        <defs>
          <style>
            .logo-triangle,
            .logo-cursor {
              fill: currentColor;
            }

            .logo-triangle {
              animation: glitch 4s ease-in-out infinite alternate;
              transform: skewX(0deg);
              transform-origin: center;
            }

            .logo-cursor {
              animation: blink 1s ease-in-out infinite alternate;
            }

            @keyframes glitch {
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
                transform: skewX(10deg);
              }

              42% {
                transform: skewX(-10deg);
              }

              59% {
                transform: skewX(35deg) skewY(10deg);
              }

              60% {
                transform: skewX(-35deg) skewY(-10deg);
              }

              63% {
                transform: skewX(10deg) skewY(-5deg);
              }

              70% {
                transform: skewX(-30deg) skewY(-20deg);
              }

              71% {
                transform: skewX(10deg) skewY(-10deg);
              }
            }

            @keyframes blink {
              0%,
              100% {
                opacity: 1;
              }

              50% {
                opacity: 0;
              }
            }
          </style>
        </defs>
        <path
          class="logo-triangle"
          d="m3.47,0l3.47,6.01H0L3.47,0Zm1.93,5.18l-1.93-3.5-1.97,3.5h3.9Z"
        />
        <path class="logo-cursor" d="m12.23,7.21v.6l-5.3-.02v-.6l5.3.02Z" />
      </svg>
    `;
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Logo);

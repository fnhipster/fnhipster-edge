const tagName = 'fn-binary';

export default class Binary extends HTMLElement {
  playing;

  current = 0;

  binary = [];

  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.play();
      } else {
        this.stop();
      }
    });
  });

  mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target === this) {
        const message = this.textContent.trim();

        this.binary = message
          .split('')
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'));
      }
    });
  });

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // observe changes to innerHTML
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true,
    });

    // observe intersection
    this.intersectionObserver.observe(this);

    // play/pause on hover
    this.addEventListener('mouseenter', this.stop);
    this.addEventListener('mouseleave', this.play);
  }

  disconnectedCallback() {
    this.stop();

    // stop observing innerHTML
    this.mutationObserver.disconnect();

    // stop observing intersection
    this.intersectionObserver.unobserve(this);

    // remove event listeners
    this.removeEventListener('mouseenter', this.stop);
    this.removeEventListener('mouseleave', this.play);
  }

  play() {
    if (this.playing) return;

    const lastIndex = this.binary.length - 1;

    this.render(this.binary[this.current]);

    this.playing = setInterval(() => {
      if (this.current === lastIndex) {
        // reset to 0 if at end of array
        this.current = 0;
      } else {
        this.current += 1;
      }

      this.render(this.binary[this.current]);
    }, 2000);
  }

  stop() {
    clearInterval(this.playing);
    this.playing = undefined;
  }

  render(message) {
    if (!message) return;
    this.shadowRoot.innerHTML = message;
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Binary);

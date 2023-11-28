import { Block } from '@/scripts/aem-blocks.js';

export default class BinaryMessage extends Block {
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

  constructor() {
    super();

    const item = this.querySelector('div[slot="item"]');

    const message = item.textContent.trim();

    this.binary = message
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'));

    // Clean DOM
    item.remove();
  }

  connectedCallback() {
    // observe intersection
    this.intersectionObserver.observe(this);

    // play/pause on hover
    this.addEventListener('mouseenter', this.stop);
    this.addEventListener('mouseleave', this.play);
  }

  disconnectedCallback() {
    this.stop();

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
    const slot = this.shadowRoot.querySelector('slot[name="binary"]');
    slot.innerText = message;
  }
}

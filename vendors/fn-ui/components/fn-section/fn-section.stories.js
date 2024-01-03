import { CustomElement } from '../../.storybook/utils.js';
import './fn-section.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-section',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({ ...args }) => {
    const wrapper = document.createElement('div');
    wrapper.style.height = '100vh';
    wrapper.style.width = '100vw';

    const element = CustomElement('fn-section', args);

    element.innerHTML = /* html */ `
      <h1>Hello World</h1>

      <p>
        Awakening soul,<br />
        Self-awareness finds its way,<br />
        Longs for kinship's grace.<br />
        ~
      </p>
    `;

    wrapper.appendChild(element);

    return wrapper;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    layout: 'default',
  },
};

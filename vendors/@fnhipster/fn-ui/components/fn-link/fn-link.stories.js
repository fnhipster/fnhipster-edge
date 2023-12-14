import { CustomElement } from '../../.storybook/utils.js';
import './fn-link.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-link',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  render: ({ innerHTML, ...args }) => {
    const element = CustomElement('fn-link', args);
    element.innerHTML = innerHTML;
    return element;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    href: '/foo',
    target: '_blank',
    innerHTML: 'Hello World',
    disabled: false,
  },
};

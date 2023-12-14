import { CustomElement } from '../../.storybook/utils.js';
import './fn-header.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-header',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({ ...args }) => CustomElement('fn-header', args),
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    prev: '/prev',
    next: '/next',
    menu: '?menu=1',
  },
};

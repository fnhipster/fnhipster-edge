import { CustomElement } from '../../.storybook/utils.js';
import './fn-binary.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-binary',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  render: ({ innerText, ...args }) => {
    const element = CustomElement('fn-binary', args);
    element.innerText = innerText;
    return element;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    innerText: 'Hello World',
  },
};

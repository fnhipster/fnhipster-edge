import { CustomElement } from '../../.storybook/utils.js';
import './fn-image.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-image',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  render: ({ ...args }) => {
    const element = CustomElement('fn-image', args);

    const inner = Object.assign(document.createElement('img'), {
      width: 200,
      height: 300,
      src: 'https://picsum.photos/200/300',
    });

    element.appendChild(inner);

    return element;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: { },
};

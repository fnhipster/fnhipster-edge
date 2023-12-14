import {
  CustomElement,
} from '../../.storybook/utils.js';

import './fn-columns.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-columns',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  render: ({ ...args }) => {
    const element = CustomElement('fn-columns', args);

    element.innerHTML = /* html */ `
      <div slot="row">
        <div>1.1</div>
        <div>1.2</div>
      </div>

      <div slot="row">
        <div>2.1</div>
        <div>2.2</div>
      </div>

      <div slot="row">
        <div>3.1</div>
        <div>3.2</div>
      </div>
    `;

    return element;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: { },
};

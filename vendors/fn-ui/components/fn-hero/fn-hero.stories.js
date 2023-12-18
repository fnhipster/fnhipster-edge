import {
  CustomElement,
} from '../../.storybook/utils.js';

import './fn-hero.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-hero',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  render: ({ title, ...args }) => {
    const element = CustomElement('fn-hero', args);

    element.innerHTML = /* html */ `
      <fn-image slot="image" >
        <img src="https://picsum.photos/seed/picsum/960/530" alt="placeholder image" width="960" height="530"/>
      </fn-image>
        
      <h1 slot="title">${title}</h1>
    `;

    return element;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    title: 'Hero Title',
  },
};

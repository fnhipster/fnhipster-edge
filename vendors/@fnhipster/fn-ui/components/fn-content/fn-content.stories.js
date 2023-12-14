import {
  CustomElement,
} from '../../.storybook/utils.js';

import './fn-content.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-content',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  render: ({ ...args }) => {
    const element = CustomElement('fn-content', args);

    element.innerHTML = /* html */ `
      <!-- Heading Elements -->
      <h1>This is a Heading 1</h1>
      <h2>This is a Heading 2</h2>
      <h3>This is a Heading 3</h3>

      <!-- Paragraphs and Text Formatting -->
      <p>This is a paragraph of text. <strong>This text is strong.</strong> <em>This text is emphasized.</em></p>

      <hr />

      <!-- Lists -->
      <ul>
          <li>Unordered List Item 1</li>
          <li>Unordered List Item 2</li>
      </ul>

      <ol>
          <li>Ordered List Item 1</li>
          <li>Ordered List Item 2</li>
      </ol>

      <blockquote>
        True Love Will Find You in the End
        
        - Daniel Johnston
      </blockquote>
    `;

    return element;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {},
};

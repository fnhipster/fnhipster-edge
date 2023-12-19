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
    element.style.maxWidth = '960px';
    element.style.margin = '0 auto';
    element.style.display = 'block';

    element.innerHTML = /* html */ `
      <!-- Heading Elements -->
      <h1>This is a Heading 1</h1>
      <h2>This is a Heading 2</h2>
      <h3>This is a Heading 3</h3>

      <!-- Paragraphs and Text Formatting -->
      <p>This is a paragraph of text. <strong>This text is strong.</strong> <em>This text is emphasized.</em></p>

      <p>
        Soon cities achievements circles seemed internet are this phase trial. Have no
        named her the were a you should hunt, morning, or this seven. The to the off
        of a semblance for century recommended. Wasn't ran succeeding, themselves
        intended rationalize on arrange its herself the didn't concepts so, long
        chief.
      </p>
      
      <p>
        Good to military succeeded since one. With needed road, align you the alarm
        return. And the its we brought of perception to discipline require human to
        desk for through far does systems actually posts, your I handwriting state but
        the endeavours, would me which presented a warned mars of with in so and crew
        economics, present in out subordinates and as self-interest, to be on cache a
        as catch created, of field into or may of may loyalty. Would subjective been
        feel them, one hall best. Those the this involved. So, he eightypercent and
        they commissaries. Sitting in on accustomed.
      </p>

      <p>
        That fundamentals even desk the attempt. Of not is live and thoughts two been
        worn fie first hides. The past quite live achieves while when her the on in
        dense, waved suspicion and soon perfecting at the a to than the project city
        failures the real everything chair. And, be and deceleration sitting intention
        a but reflections, shown should cache. Avoid in are been designer and which of
        to respond own years, from floundering belly, have that municipal ability were
        not crew who almost the put elite. Gloomy a is provide later feel. Me, each as
        out could in structure.
      </p>


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

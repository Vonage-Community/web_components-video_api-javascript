import { html } from 'lit';
import '../white-board.js';

export default {
  title: 'WhiteBoard',
  component: 'white-board',
  argTypes: {
    header: { control: 'text' },
    counter: { control: 'number' },
    textColor: { control: 'color' },
  },
};

function Template({ header = 'Hello world', counter = 5, textColor, slot }) {
  return html`
    <white-board
      style="--white-board-text-color: ${textColor || 'black'}"
      .header=${header}
      .counter=${counter}
    >
      ${slot}
    </white-board>
  `;
}

export const Regular = Template.bind({});

export const CustomHeader = Template.bind({});
CustomHeader.args = {
  header: 'My header',
};

export const CustomCounter = Template.bind({});
CustomCounter.args = {
  counter: 123456,
};

export const SlottedContent = Template.bind({});
SlottedContent.args = {
  slot: html`<p>Slotted content</p>`,
};
SlottedContent.argTypes = {
  slot: { table: { disable: true } },
};

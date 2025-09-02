# \<live-poll-control>

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation and is meant to be used with the [Vonage Video Client SDK](https://developer.vonage.com/en/video/client-sdks/web/overview).

> A [Vonage account](https://ui.idp.vonage.com/ui/auth/registration) will be needed.

A goal is to simplify the code needed to create a real-time, high-quality interactive video application quickly. This Web Component allows for the creation and management of a poll.

## Installation

```bash
npm i @vonage/live-poll-control
```

## Usage

```html
<script type="module">
  import '@vonage/live-poll-control/live-poll-control.js';
</script>
```

### OR using a CDN
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@vonage/live-poll-control@latest/live-poll-control.js/+esm"></script>

```

### place tag in HTML

```html
<live-poll-control></live-poll-control>
```

### Attributes that can be used (optional):

- `title-text` : (String) title of the poll
- `title-placeholder` : (String) placeholder text for the input to set the poll title
- `start-button-text` : (String) text for the button to start the poll
- `stop-button-text` : (String) text for the button to stop the poll
- `reset-button-text` : (String) text for the button to reset the poll
- `close-button-text` : (String) text for the button to close the poll
- `remove-button-text` : (String) text for the button to remove an option
- `placeholder` : (String) placeholder text for input to enter an option
- `input-button-text` : (String) text for the button to enter an option

```html
<live-poll-control title-text="Are Web Components Awesome?"></live-poll-control>
```

## Styling

The Web Component uses the [CSS pseudo-element `::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) for styling. So you can style it the same way you would style a regular button element. Here's an example:

This is the HTML structure of the Web Component:

```html
<div id="container" part="container">
  <h1 id="title-preview" part="title-preview">Poll Title</h1>
  <input placeholder="enter poll title" id="poll-title" name="poll-title-input" part="title-input"></input>
  <ul id="options" part="options">
    <li part="option">
      <span part="option-container"><input name="option-text-0" part="option-input"></input><button part="remove-button">remove</button></span>
      <progress id="option-progress-0" name="option-progress-0" max="100" part="option-progress">70%</progress><output name="option-result-0" for="option-progress-0" part="option-output">7</output>
    </li>
  </ul>
  <form id="form" part="form">
    <input type="text" name="optionTxt" placeholder="enter option" id="optionTxt" part="input"></input>
    <button type="submit">enter</button>
  </form>
  <button part="stop-button">stop poll</button>`
  <button part="start-button">start poll</button>          
  <button part="reset-button">reset poll</button>
  <button part="close-button">close poll</button>
<div>
```

Here is how to apply CSS to a part:
```css
live-poll-control {
  --live-poll-control-nth-child-odd-color: #dbd9d9;
  --live-poll-control-nth-child-even-color: #fcfcfc;
}

live-poll-control::part(button) {
  color: white;
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid black;
  border-radius: 6px;
  cursor: pointer;
  background: #871fff;
  font-size: 1.4rem;
}
```

## Getting it to work

1. Get a reference to the Web Component.
2. Generate a Session and Token.
3. Pass Session and Token into Web Component reference.

>**Note**: This can vary with library / framework (see [examples folder](../examples))

## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

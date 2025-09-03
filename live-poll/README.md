# \<live-poll>

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation and is meant to be used with the [Vonage Video Client SDK](https://developer.vonage.com/en/video/client-sdks/web/overview).

> A [Vonage account](https://ui.idp.vonage.com/ui/auth/registration) will be needed.

A goal is to simplify the code needed to create a real-time, high-quality interactive video application quickly. This Web Component allows for users to vote in a poll.

## Installation

```bash
npm i @vonage/live-poll
```

## Usage

```html
<script type="module">
  import '@vonage/live-poll/live-poll.js';
</script>
```

### OR using a CDN
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@vonage/live-poll@latest/live-poll.js/+esm"></script>

```

### place tag in HTML

```html
<live-poll></live-poll>
```

### Custom Event to listen for 

- `poll-status` : status of the poll. Can be either started, stopped, resetted, closed, or vote.

## Styling

The Web Component uses the [CSS pseudo-element `::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) for styling. So you can style it the same way you would style a regular button element. Here's an example:

This is the HTML structure of the Web Component:

```html
<div id="container" part="container">
  <p part="title">Poll Title</p>
  <ul id="options" part="options">
    <li part="option">
      <span part="option-container"><input type="radio" id="option-text-0" name="option" part="radio" /><label for="option-text-0" part="label">Option 0</label></span>
      <progress id="option-progress-0" name="option-progress-0" max="100" part="progress">70%</progress><output name="option-result-0" for="option-progress-0" part="output">7</output>
    </li>
  </ul>
  <button part="button">vote</button>
</div>
```

Here is how to apply CSS to a part and sample code:
```css
live-poll {
  --live-poll-nth-child-odd-color: #dbd9d9;
  --live-poll-nth-child-even-color: #fcfcfc;
}

live-poll::part(options){
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: auto;
  list-style: none;
}

live-poll::part(option){
  padding: 10px;
}

live-poll::part(option-container){
  display: block;
}

live-poll::part(progress){
  margin-left: 20px;
}

live-poll::part(button) {
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

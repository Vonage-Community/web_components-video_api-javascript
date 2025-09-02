# \<live-chat>

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation and is meant to be used with the [Vonage Video Client SDK](https://developer.vonage.com/en/video/client-sdks/web/overview).

> A [Vonage account](https://ui.idp.vonage.com/ui/auth/registration) will be needed.

A goal is to simplify the code needed to create a real-time, high-quality interactive video application quickly. This Web Component allows for users to chat.

## Installation

```bash
npm i @vonage/live-chat
```

## Usage

```html
<script type="module">
  import '@vonage/live-chat/live-chat.js';
</script>
```

### OR using a CDN
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@vonage/live-chat@latest/live-chat.js/+esm"></script>

```

### place tag in HTML

```html
<live-chat></live-chat>
```

### Attributes that can be used (optional):

- `placeholder` : (String) placeholder text for input to enter a message
- `button-text` : (String) text for the button to send a message
- `show-button` : (Boolean) place attribute in element if you want the button to send a message to appear.

```html
<live-chat placeholder="Enter your message" button-text="send" show-button></live-chat>
```

## Styling

The Web Component uses the [CSS pseudo-element `::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) for styling. So you can style it the same way you would style a regular button element. Here's an example:

This is the HTML structure of the Web Component:

```html
<div id="container" part="container">
  <p id="history" part="history"></p>
  <form id="form" part="form">
    <input type="text" name="msgTxt" placeholder="Enter message" id="msgTxt" part="input"></input>
    <button type="submit" part="button">send</button>
  </form>
</div>
```

Here is how to apply CSS to a part and some sample values:
```css
live-chat {
  height: 100%;
  width: 30vw;
}

live-chat::part(history) {
  height: 300px;
  overflow-y: auto;
}

live-chat::part(form) {
  display: flex;
}

live-chat::part(input) {
  width: 100%;
}

live-chat::part(message) {
  padding: 15px;
  margin: 5px;
}

live-chat::part(message mine) {
  text-align: right;
}

live-chat::part(message-text) {
  border-radius: 6px;
  background-color: #f0f0f0;
  display: inline-block;
  padding: 2px 8px;
  margin: 0;
  border-radius: 6px 6px 6px 0;
  font-size: 1.4rem;
}

live-chat::part(message-text mine) {
  background-color: #e0e0ff;
  border-radius: 6px 6px 0px 6px;
}

live-chat::part(message-image mine) {
  background-color: #e0e0ff;
  border-radius: 6px 6px 0px 6px;
}

live-chat::part(message-sender) {
  font-size: 0.8rem;
  margin: 0;
  padding: 0;
}

live-chat::part(message-sender mine) {
  text-align: right;
  color: black;
}
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

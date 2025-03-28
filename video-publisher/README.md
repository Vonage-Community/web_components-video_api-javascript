# \<video-publisher>

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation and is meant to be used with the [Vonage Video Client SDK](https://developer.vonage.com/en/video/client-sdks/web/overview).

> A [Vonage account](https://ui.idp.vonage.com/ui/auth/registration) will be needed.

A goal is to simplify the code needed to create a real-time, high-quality interactive video application quickly. This Web Component will display the user's feed and publish to the session.

## Installation

```bash
npm i @vonage/video-publisher
```

## Usage

### import from node modules

```html
<script type="module">
  import '@vonage/video-publisher/video-publisher.js';
</script>
```

### OR using a CDN
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@vonage/video-publisher@latest/video-publisher.js/+esm"></script>

```

### place tag in HTML

```html
<video-publisher></video-publisher>
```

### Attributes that can be used (optional):

- `auto-publish` : (String) whether to auto publish video when connected to session. Default is "true". For example, you can set to false and use the [<inputs-select>](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/inputs-select) component to set audio/video sources.
- `properties` : (Object) the properties used to initialize the publisher. Find the full list in the [documentation](https://vonage.github.io/conversation-docs/video-js-reference/latest/OT.html#initPublisher).

```html
<video-publisher auto-publish="false"></video-publisher>
```

### Methods that can be called

- `startPublish()` : start publishing to session
- `toggleAudio()` : start/stop publishing audio
- `toggleVideo()` : start/stop publishing video
- `cycleVideo()` : switches the video input source

### Custom Event to listen for 

- `published` : event detail contains the [publisher Object](https://vonage.github.io/conversation-docs/video-js-reference/latest/Publisher.html)
- `error` : event detail contains any error that happened.

## Getting it to work

1. Get a reference to the Web Component.
2. Generate a Session and Token.
3. Pass Session and Token into Web Component reference.

>**Note**: This can vary with library / framework (see [examples folder](../examples))

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

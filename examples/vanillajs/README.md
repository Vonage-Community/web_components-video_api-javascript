# Vanilla JS x Video API Web Components

This demo was created with [Stackblitz's Static Starter App](https://stackblitz.com/fork/web-platform) to create a barebones applications to focus on integrating the Web Components.

Deployed application:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/Vonage-Community/web_components-video_api-javascript/tree/main/examples/vanillajs)

> Note: There is a devDependency in the project that is only necessary to run the demo on StackBlitz. If you download the code, you should be able to just open the index.html file in a browser to see it working.

## The Web Components

- `<video-publisher>` : Initializes a publisher and publishes to the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-publisher)
- `<video-subscribers>` : Subscribes and displays other streams in the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-subscribers)
- `<video-subscriber>` : Subscribes and displays an individual stream in the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-subscriber)
- `<screen-share>` : Adds ability to allow user to share their screen. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/screen-share)
- `<inputs-select>` : Select video and audio inputs for the < video-publisher >. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/inputs-select)
- `<white-board>` : Adds ability for publisher to display a whiteboard to the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/white-board)

## How to use

### 1. Get the Client SDK
place into your index.html
```html
<script src="https://cdn.jsdelivr.net/npm/@vonage/client-sdk-video@latest/dist/js/opentok.min.js"></script>
```

### 2. Get the Web Components

install to your project
```bash
npm i @vonage/video-publisher
npm i @vonage/video-subscribers
npm i @vonage/screen-share
```
then import into your project
```js
import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';
import '@vonage/screen-share/screen-share.js';
```

OR use a CDN and place in your index.html file
```html
<script type="module" src="https://unpkg.com/@vonage/video-publisher@latest/video-publisher.js?module"></script>
<script type="module" src="https://unpkg.com/@vonage/video-subscribers@latest/video-subscribers.js?module"></script>
<script type="module" src="https://unpkg.com/@vonage/screen-share@latest/screen-share.js?module"></script>
```

### 3. Place the Web Components
where you want them to show up in your app
```html
<video-publisher></video-publisher>
<video-subscribers></video-subscribers>
<screen-share start-text="start" stop-text="stop" width="300px" height="240px"></screen-share>
```

### 4. Get references to the Web Components
```js
const videoPublisherEl = document.querySelector('video-publisher');
const videoSubscribersEl = document.querySelector('video-subscribers');
const screenShareEl = document.querySelector('screen-share');
```

### 5. Get `applicationId`, `sessionId`, and `token`
>**Note**: In production applications, they are retrieved from the server [more info](https://developer.vonage.com/en/video/server-sdks/overview). For this demo, they are hardcoded.

To get the credentials needed to run the demo:
- [Sign up for](https://ui.idp.vonage.com/ui/auth/registration) or [Log into](https://ui.idp.vonage.com/ui/auth/login) your account.
- In the left-side menu of the [dashboard](https://developer.vonage.com/), click `Applications` and select a previous application or create a new one to view the Application ID.

    ![Screenshot of dashboard with Applications highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vanillajs/vonage-dashboard-screenshot.jpg)

    ![Screenshot of dashboard with Application ID highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vanillajs/vonage-application-screenshot.jpg)

- Make sure that Video is activated

    ![Screenshot of dashboard with Video section highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vanillajs/vonage-video-details-screenshot.jpg)

- Head over to the [The Video API Playground.](https://tools.vonage.com/video/playground) Either enter the Application ID or find it in the dropdown. You can leave the default values for the other options. Click "Create".

    ![Screenshot of The Video API Playground tool](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vanillajs/vonage-video-api-playground-screenshot.jpg)

- Your Session ID and Token will be created.

    ![Screenshot of The Video API Playground tool generated details with the Application ID, Session ID, and Token highlighted in red boxes](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vanillajs/vonage-video-api-playground-session-id-token-screenshot.jpg)

### 6. Create a session
```js
const session = OT.initSession(applicationId, sessionId);
```

### 7. Set the session and token for Web Components
```js
videoPublisherEl.session = session;
videoPublisherEl.token = token;
videoSubscribersEl.session = session;
videoSubscribersEl.token = token;
screenShareEl.session = session;
screenShareEl.token = token;
```

### 8. (Optional) Set properties attribute for Web Components (if available)
```js
videoPublisherEl.properties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/OT.html#initPublisher))
```js
videoSubscribersEl.properties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/Session.html#subscribe))

### That's it!

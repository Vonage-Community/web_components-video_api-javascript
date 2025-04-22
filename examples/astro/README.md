# Astro x Video API Web Components

This demo was created with [Stackblitz's Astro Basics Starter](https://stackblitz.com/fork/github/withastro/astro/tree/latest/examples/basics?file=README.md&title=Astro%20Starter%20Kit:%20Basics) to create a barebones applications to focus on integrating the Web Components.

Deployed application:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/Vonage-Community/web_components-video_api-javascript/tree/main/examples/astro)

> Note: There is a devDependency in the project that is only necessary to run the demo on StackBlitz. If you download the code, you should be able to just open the index.html file in a browser to see it working.

## The Web Components

- `<video-publisher>` : Initializes a publisher and publishes to the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-publisher)
- `<video-subscribers>` : Subscribes and displays other streams in the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-subscribers)

## How to use

### 1. Get the Client SDK
place into your Layout.astro
```html
<script src="https://cdn.jsdelivr.net/npm/@vonage/client-sdk-video@latest/dist/js/opentok.min.js"></script>
```

### 2. Get the Web Components

install to your project
```bash
npm i @vonage/video-publisher
npm i @vonage/video-subscribers
```
then import into your Astro component(s)
```js
import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';
```

OR use a CDN and place in your Astro component(s)
```html
<script is:inline type="module" src="https://cdn.jsdelivr.net/npm/@vonage/video-publisher@latest/video-publisher.js/+esm"></script>
<script is:inline type="module" src="https://cdn.jsdelivr.net/npm/@vonage/video-subscribers@latest/video-subscribers.js/+esm"></script>
```

### 3. Place the Web Components
where you want them to show up in your app
```html
<video-publisher></video-publisher>
<video-subscribers></video-subscribers>
```

### 4. Get references to the Web Components
```js
const videoPublisherEl = document.querySelector('video-publisher');
const videoSubscribersEl = document.querySelector('video-subscribers');
```

### 5. Get `applicationId`, `sessionId`, and `token`
>**Note**: In production applications, they are retrieved from the server [more info](https://developer.vonage.com/en/video/server-sdks/overview). For this demo, you can either deploy a Video Learning Server ([Node](https://github.com/Vonage-Community/sample-video-node-learning_server) or [PHP](https://github.com/Vonage-Community/sample-video-php-learning_server)) and set `serverURL` or follow the next steps to generate and hardcode them.

To get the credentials needed to run the demo:
- [Sign up for](https://ui.idp.vonage.com/ui/auth/registration) or [Log into](https://ui.idp.vonage.com/ui/auth/login) your account.
- In the left-side menu of the [dashboard](https://developer.vonage.com/), click `Applications` and select a previous application or create a new one to view the Application ID.

    ![Screenshot of dashboard with Applications highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/astro/vonage-dashboard-screenshot.jpg)

    ![Screenshot of dashboard with Application ID highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/astro/vonage-application-screenshot.jpg)

- Make sure that Video is activated

    ![Screenshot of dashboard with Video section highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/astro/vonage-video-details-screenshot.jpg)

- Head over to the [The Video API Playground.](https://tools.vonage.com/video/playground) Either enter the Application ID or find it in the dropdown. You can leave the default values for the other options. Click "Create".

    ![Screenshot of The Video API Playground tool](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/astro/vonage-video-api-playground-screenshot.jpg)

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

# React x Video API Web Components

This demo was created with the [StackBlitz React Starter Project](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-react?file=index.html&terminal=dev) to create a barebones application to focus on integrating the Web Components.

Deployed application:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/Vonage-Community/web_components-video_api-javascript/tree/main/examples/react)

## The Web Components

- `<video-publisher>` : Initializes a publisher and publishes to the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-publisher)
- `<video-subscribers>` : Subscribes and displays other streams in the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-subscribers)

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
```
then import into your project
```js
import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';
```

OR use a CDN and place in your index.html file
```html
<script type="module" src="https://unpkg.com/@vonage/video-publisher@latest/video-publisher.js?module"></script>
<script type="module" src="https://unpkg.com/@vonage/video-subscribers@latest/video-subscribers.js?module"></script>
```

### 3. Place the Web Components
where you want them to show up in your app
for ex:
```html
<video-publisher ref={publisher}></video-publisher>
<video-subscribers ref={subscribers}></video-subscribers>
```

### 4. Get references to the Web Components using `useRef`
```js
const publisher = useRef(null);
const subscribers = useRef(null);
```

### 5. Get `applicationId`, `sessionId`, and `token`
>**Note**: In production applications, they are retrieved from the server [more info](https://developer.vonage.com/en/video/server-sdks/overview). For this demo, they are hardcoded.

To get the credentials needed to run the demo:
- [Sign up for](https://ui.idp.vonage.com/ui/auth/registration) or [Log into](https://ui.idp.vonage.com/ui/auth/login) your account.
- In the left-side menu of the [dashboard](https://developer.vonage.com/), click `Applications` and select a previous application or create a new one to view the Application ID.

    ![Screenshot of dashboard with Applications highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/react/vonage-dashboard-screenshot.jpg)

    ![Screenshot of dashboard with Application ID highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/react/vonage-application-screenshot.jpg)

- Make sure that Video is activated

    ![Screenshot of dashboard with Video section highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/react/vonage-video-details-screenshot.jpg)

- Head over to the [The Video API Playground.](https://tools.vonage.com/video/playground) Either enter the Application ID or find it in the dropdown. You can leave the default values for the other options. Click "Create".

    ![Screenshot of The Video API Playground tool](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/react/vonage-video-api-playground-screenshot.jpg)

- Your Session ID and Token will be created.

    ![Screenshot of The Video API Playground tool generated details with the Application ID, Session ID, and Token highlighted in red boxes](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/react/vonage-video-api-playground-session-id-token-screenshot.jpg)

### 6. Create a session
```js
const session = OT.initSession(applicationId, sessionId);
```

### 7. Set the session and token for Web Components
```js
publisher.current.session = session;
publisher.current.token = token;
subscribers.current.session = session;
subscribers.current.token = token;
```

### 8. (Optional) Set properties attribute for Web Components (if available)
```js
publisher.current.properties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/OT.html#initPublisher))
```js
subscribers.current.properties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/Session.html#subscribe))

### That's it!

We have a more in-depth blogpost covering older versions of React.
[Using Web Components in a React Application](https://developer.vonage.com/blog/20/10/07/using-web-components-in-a-react-application-dr)


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Vue x Video API Web Components

This demo was created with [Stackblitz's Vue Starter App](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vue?file=index.html&terminal=dev) to create a barebones application to focus on integrating the Web Components.

Deployed application:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/Vonage-Community/web_components-video_api-javascript/tree/main/examples/vue)

## The Web Components

- `<video-publisher>` : Initializes a publisher and publishes to the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-publisher)
- `<video-subscribers>` : Subscribes and displays other streams in the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-subscribers)

## How to use

### 1. Set `compilerOptions.isCustomElement`
so that Vue knows you will be using Web Components. This may vary depending on how you are compiling your application as it states in the [documentation](https://vuejs.org/guide/extras/web-components.html).
For this demo, Vite will be used for compilation, so in your vite.config.js, it should look like this:
```js
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ],
})
```

### 2. Get the Client SDK
place into your index.html
```html
<script src="https://cdn.jsdelivr.net/npm/@vonage/client-sdk-video@latest/dist/js/opentok.min.js"></script>
```

### 3. Get the Web Components

install to your project
```bash
npm i @vonage/video-publisher
npm i @vonage/video-subscribers
```
then import into your `*.vue` project file
```js
import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';
```

OR use a CDN and place in your index.html file
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@vonage/video-publisher@latest/video-publisher.js/+esm"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@vonage/video-subscribers@latest/video-subscribers.js/+esm"></script>
```

### 4. Place the Web Components
where you want them to show up in your app
for ex:
```html
<video-publisher ref="publisher"></video-publisher>
<video-subscribers ref="subscribers"></video-subscribers>
```

### 5. Get references to the Web Components using `ref`
```html
const publisher = ref(null);
const subscribers = ref(null);
```

### 6. Get `applicationId`, `sessionId`, and `token`
>**Note**: In production applications, they are retrieved from the server [more info](https://developer.vonage.com/en/video/server-sdks/overview). For this demo, you can either they are hardcoded.

To get the credentials needed to run the demo:
- [Sign up for](https://ui.idp.vonage.com/ui/auth/registration) or [Log into](https://ui.idp.vonage.com/ui/auth/login) your account.
- In the left-side menu of the [dashboard](https://developer.vonage.com/), click `Applications` and select a previous application or create a new one to view the Application ID.

    ![Screenshot of dashboard with Applications highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vue/vonage-dashboard-screenshot.jpg)

    ![Screenshot of dashboard with Application ID highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vue/vonage-application-screenshot.jpg)

- Make sure that Video is activated

    ![Screenshot of dashboard with Video section highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vue/vonage-video-details-screenshot.jpg)

- Head over to the [The Video API Playground.](https://tools.vonage.com/video/playground) Either enter the Application ID or find it in the dropdown. You can leave the default values for the other options. Click "Create".

    ![Screenshot of The Video API Playground tool](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vue/vonage-video-api-playground-screenshot.jpg)

- Your Session ID and Token will be created.

    ![Screenshot of The Video API Playground tool generated details with the Application ID, Session ID, and Token highlighted in red boxes](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/vue/vonage-video-api-playground-session-id-token-screenshot.jpg)

### 7. Create a session
```js
const session = OT.initSession(applicationId, sessionId);
```

### 8. Set the session and token for Web Components
```js
publisher.value.session = session;
publisher.value.token = token;
subscribers.value.session = session;
subscribers.value.token = token;
```

### 9. (Optional) Set properties attribute for Web Components (if available)
```js
publisher.value.properties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/OT.html#initPublisher))
```js
subscribers.value.properties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/Session.html#subscribe))

### That's it!

We go more in-depth in our blogpost
[Use Web Components in Vue 2 and 3 + Composition API](https://developer.vonage.com/blog/20/10/30/use-web-components-in-vue-2-and-3-composition-api-dr).



# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# Angular x Video API Web Components

This demo was created with [Stackblitz's Angular Starter App](https://stackblitz.com/fork/angular-ivy) to create a barebones application to focus on integrating the Web Components.

Deployed application:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/Vonage-Community/web_components-video_api-javascript/tree/main/examples/angular)

## The Web Components

- `<video-publisher>` : Initializes a publisher and publishes to the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-publisher)
- `<video-subscribers>` : Subscribes and displays other streams in the session. [more info](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/video-subscribers)

## How to use

### 1. Include `CUSTOM_ELEMENTS_SCHEMA`
so that Angular knows you will be using Web Components
```js
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
```
include in `@NgModule`
```js
schemas: [CUSTOM_ELEMENTS_SCHEMA]
```

### 2. Get the Client SDK
place into your index.html
```html
<script src="https://cdn.jsdelivr.net/npm/@vonage/client-sdk-video@latest/dist/js/opentok.min.js"></script>
```

OR if you install the library using `npm install --save @vonage/client-sdk-video`
```html
<script src="node_modules/@vonage/client-sdk-video/dist/js/opentok.min.js"></script>
```

### 3. Get the Web Components

install to your project
```bash
npm i @vonage/video-publisher
npm i @vonage/video-subscribers
npm i @vonage/screen-share
```
then import into your `*.component.ts` project file
```js
import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';
```

OR use a CDN and place in your index.html file
```html
<script type="module" src="https://unpkg.com/@vonage/video-publisher@latest/video-publisher.js?module"></script>
<script type="module" src="https://unpkg.com/@vonage/video-subscribers@latest/video-subscribers.js?module"></script>
```

### 4. Place the Web Components
where you want them to show up in your app
for ex:
```html
<video-publisher #publisher [session]="session" [token]="token" [properties]="pubProperties"></video-publisher>
<video-subscribers #subscribers [session]="session" [token]="token" [properties]="subsProperties"></video-subscribers>
```

### 5. Get references to the Web Components using `ViewChild` and `ElementRef`
```js
@ViewChild('publisher') publisherComponent: ElementRef;
@ViewChild('subscribers') subscribersComponent: ElementRef;
```

### 6. Get `applicationId`, `sessionId`, and `token`
>**Note**: In production applications, they are retrieved from the server [more info](https://developer.vonage.com/en/video/server-sdks/overview). For this demo, they are hardcoded.

To get the credentials needed to run the demo:
- [Sign up for](https://ui.idp.vonage.com/ui/auth/registration) or [Log into](https://ui.idp.vonage.com/ui/auth/login) your account.
- In the left-side menu of the [dashboard](https://developer.vonage.com/), click `Applications` and select a previous application or create a new one to view the Application ID.

    ![Screenshot of dashboard with Applications highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/angular/vonage-dashboard-screenshot.jpg)

    ![Screenshot of dashboard with Application ID highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/angular/vonage-application-screenshot.jpg)

- Make sure that Video is activated

    ![Screenshot of dashboard with Video section highlighted](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/angular/vonage-video-details-screenshot.jpg)

- Head over to the [The Video API Playground.](https://tools.vonage.com/video/playground) Either enter the Application ID or find it in the dropdown. You can leave the default values for the other options. Click "Create".

    ![Screenshot of The Video API Playground tool](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/angular/vonage-video-api-playground-screenshot.jpg)

- Your Session ID and Token will be created.

    ![Screenshot of The Video API Playground tool generated details with the Application ID, Session ID, and Token highlighted in red boxes](https://github.com/Vonage-Community/web_components-video_api-javascript/raw/main/examples/angular/vonage-video-api-playground-session-id-token-screenshot.jpg)

### 7. Create a session
```js
this.session = this.OT.initSession(this.applicationId, this.sessionId);
```

### 8. (Optional) Set properties attribute for Web Components (if available)
```js
pubProperties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/OT.html#initPublisher))
```js
subsProperties = { ... };
```
(see [full list](https://vonage.github.io/conversation-docs/video-js-reference/latest/Session.html#subscribe))

### That's it!

We go more in-depth in our blogpost
[Using Web Components in an Angular application: Joyful & Fun](https://developer.vonage.com/blog/21/02/16/using-web-components-in-an-angular-application-joyful-fun).

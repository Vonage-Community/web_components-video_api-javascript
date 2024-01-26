const videoPublisherEl = document.querySelector('video-publisher');
const audioToggle = document.querySelector('#audio-toggle');
const videoToggle = document.querySelector('#video-toggle');

const videoSubscribersEl = document.querySelector('video-subscribers');

const screenShareEl = document.querySelector('screen-share');

const videoSubscriberContainerCamera = document.querySelector('#camera');

const videoSubscriberContainerCustom = document.querySelector('#custom');

const videoSubscriberContainerScreen = document.querySelector('#screen');

const whiteboardEl = document.querySelector('white-board');
const whiteboardButton = document.querySelector('#whiteboard-button');
const whiteboardDialog = document.querySelector('#whiteboard-dialog');

const inputsSelectEl = document.querySelector('inputs-select');

// These values normally come from the backend in a production application, but for this demo, they are hardcoded
const applicationId = 'YOUR_APPLICATION_ID';
const sessionId = 'YOUR_SESSION_ID';
const token = 'YOUR_TOKEN';

// Initialize a Vonage Session object
const session = OT.initSession(applicationId, sessionId);

// Set session and token (and optionally properties) for Web Components
if (videoPublisherEl) {
  videoPublisherEl.session = session;
  videoPublisherEl.token = token;
  videoPublisherEl.properties = {
    fitMode: 'cover',
    height: '100%',
    resolution: '1920x1080',
    videoContentHint: 'detail',
    width: '100%',
  };

  audioToggle.addEventListener('click', () => {
    console.log('audioToggle!');
    videoPublisherEl.toggleAudio();
  });

  videoToggle.addEventListener('click', () => {
    console.log('videoToggle!');
    videoPublisherEl.toggleVideo();
  });
}

if (videoSubscribersEl) {
  videoSubscribersEl.session = session;
  videoSubscribersEl.token = token;
}

if (screenShareEl) {
  screenShareEl.session = session;
  screenShareEl.token = token;

  session.on('streamCreated', function (event) {
    console.log('streamCreated!', event.stream.videoType);
    const videoSubscriberEl = document.createElement('video-subscriber');
    videoSubscriberEl.setAttribute('id', `${event.stream.streamId}`);
    videoSubscriberEl.properties = { width: '100%', height: '100%' };
    // videoSubscriberEl.properties = { width: '100%', height: '100%' };
    videoSubscriberEl.session = session;
    videoSubscriberEl.stream = event.stream;
    if (event.stream.videoType === 'camera') {
      videoSubscriberContainerCamera.appendChild(videoSubscriberEl);
    } else if (event.stream.videoType === 'screen') {
      videoSubscriberContainerScreen.appendChild(videoSubscriberEl);
    }
  });
}

if (whiteboardEl) {
  whiteboardEl.session = session;
  whiteboardEl.token = token;

  whiteboardButton.addEventListener('click', () => {
    whiteboardDialog.showModal();
  });

  session.on('streamCreated', function (event) {
    console.log('streamCreated!', event.stream.videoType);
    const videoSubscriberEl = document.createElement('video-subscriber');
    videoSubscriberEl.setAttribute('id', `${event.stream.streamId}`);
    videoSubscriberEl.properties = { width: '100%', height: '100%' };
    // videoSubscriberEl.properties = { width: '100%', height: '100%' };
    videoSubscriberEl.session = session;
    videoSubscriberEl.stream = event.stream;
    if (event.stream.videoType === 'camera') {
      videoSubscriberContainerCamera.appendChild(videoSubscriberEl);
    } else if (event.stream.videoType === 'custom') {
      videoSubscriberContainerCustom.appendChild(videoSubscriberEl);
    }
  });
}

if (inputsSelectEl) {
  videoPublisherEl.style.display = 'none';
  audioToggle.style.display = 'none';
  videoToggle.style.display = 'none';
  inputsSelectEl.addEventListener('inputsSelected', (event) => {
    inputsSelectEl.style.display = 'none';
    videoPublisherEl.session = session;
    videoPublisherEl.token = token;
    videoPublisherEl.properties = {
      audioSource: event.detail.audioSource,
      videoSource: event.detail.videoSource,
    };
    videoPublisherEl.style.display = 'block';
    videoPublisherEl.startPublish();
    audioToggle.style.display = 'inline';
    videoToggle.style.display = 'inline';
  });
}

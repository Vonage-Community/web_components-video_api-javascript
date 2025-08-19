const liveChatEl = document.querySelector('live-chat');

let serverURL;
let applicationId = 'YOUR_APPLICATION_ID';
let sessionId = 'YOUR_SESSION_ID';
let token = 'YOUR_TOKEN';

function initializeSession() {
  const session = OT.initSession(applicationId, sessionId);
  // Set session and token (and optionally properties) for Web Components
  liveChatEl.session = session;
  liveChatEl.token = token;
  liveChatEl.username = 'Alice';
}


if (serverURL){
  const fetchCredentials = async () => {
    try {
      const response = await fetch(serverURL+ '/session');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const credentials = await response.json();
      applicationId = credentials.applicationId;
      sessionId = credentials.sessionId;
      token = credentials.token;
      initializeSession();
    } catch (err) {
      console.error('Error getting credentials: ', err.message);
    }
  };
  fetchCredentials();
} else {
  initializeSession();
};

const livePollControlEl = document.querySelector('live-poll');

let serverURL;
let applicationId = '';
let sessionId = '';
let token = '';

function initializeSession() {
  const session = OT.initSession(applicationId, sessionId);
  // Set session and token (and optionally properties) for Web Components
  livePollControlEl.session = session;
  livePollControlEl.token = token;
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

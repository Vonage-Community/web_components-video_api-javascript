import React, { useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';

function App() {
  // Get references to Web Components
  const publisher = useRef(null);
  const subscribers = useRef(null);

  // These values normally come from the backend in a production application, but for this demo, they are hardcoded
  const applicationId = 'YOUR_APPLICATION_ID';
  const sessionId = 'YOUR_SESSION_ID';
  const token = 'YOUR_TOKEN';

  const toggleVideo = () => {
    publisher.current.toggleVideo();
  };

  const toggleAudio = () => {
    publisher.current.toggleAudio();
  };

  useEffect(() => {
    const OT = window.OT;

    // Initialize an OpenTok Session object
    const session = OT.initSession(applicationId, sessionId);

    // Set session and token (and optionally properties) for Web Components
    publisher.current.session = session;
    publisher.current.token = token;
    publisher.current.properties = {
      fitMode: 'cover',
      height: '100%',
      resolution: '1920x1080',
      videoContentHint: 'detail',
      width: '100%',
    };
    subscribers.current.session = session;
    subscribers.current.token = token;
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-container">
        <section className="App-section-publisher">
          <fieldset>
            <legend>Publisher</legend>
            <video-publisher ref={publisher}></video-publisher>
          </fieldset>
          <button onClick={toggleVideo}>
              toggle Video
          </button>
          <button onClick={toggleAudio}>
              toggle Audio
          </button>
        </section>
        <section className="App-section-subscribers">
          <fieldset>
            <legend>Subscribers</legend>
            <video-subscribers ref={subscribers}></video-subscribers>
          </fieldset>
        </section>
      </div>
    </div>
  );
}

export default App;

import React, { useRef, useEffect } from 'react';
import logo from './assets/react.svg';
import './App.css';

import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';

function App() {
  // Get references to Web Components
  const publisher = useRef(null);
  const subscribers = useRef(null);

  // If you have a Vonage Learning Server deployed, you can set your URL here.
  let serverURL;
  
  // OR you can hardcode the values here. (In production, you make a request to your backend to get these values.)
  let applicationId = 'YOUR_APPLICATION_ID';
  let sessionId = 'YOUR_SESSION_ID';
  let token = 'YOUR_TOKEN';

  function initializeSession() {
    // Initialize a Vonage Video Session object
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
  };

  const toggleVideo = () => {
    publisher.current.toggleVideo();
  };

  const toggleAudio = () => {
    publisher.current.toggleAudio();
  };

  useEffect(() => {
    const OT = window.OT;
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
  },[]);

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

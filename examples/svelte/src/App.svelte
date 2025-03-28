<script>
  import { onMount, tick } from 'svelte';
  import svelteLogo from './assets/svelte.svg'
  import '@vonage/video-publisher/video-publisher.js';
  import '@vonage/video-subscribers/video-subscribers.js';

  let publisher;
  let subscribers;

  let serverURL;
  let applicationId = 'YOUR_APPLICATION_ID';
  let sessionId = 'YOUR_SESSION_ID';
  let token = 'YOUR_TOKEN';

  function initializeWebComponents(session) {
    // Set session and token (and optionally properties) for Web Components  
    if (publisher) {
      publisher.session = session;
      publisher.token = token;
      publisher.properties = {
        fitMode: 'cover',
        height: '100%',
        resolution: '1920x1080',
        videoContentHint: 'detail',
        width: '100%',
      };
    } else {
      console.log('Publisher Web Component reference is not available yet.');
    }
    if (subscribers) {
      subscribers.session = session;
      subscribers.token = token;
    } else {
      console.log('Subscribers Web Component reference is not available yet.');
    }
  }

  function initializeSession() {
    const session = OT.initSession(applicationId, sessionId);
    if (serverURL){
      initializeWebComponents(session);
    } else {
      $effect(() => {
        tick().then(() => {
          initializeWebComponents(session);
        });
      });
    }
  }

  function toggleVideo() {
    publisher.toggleVideo();
  }

  function toggleAudio() {
    publisher.toggleAudio();
  }

  onMount(() => {
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
  });
</script>

<div>
  <header> 
    <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
  </header>
  <main id="video-chat-container">
    <section id="publisher-container">
      <fieldset>
        <legend>Publisher</legend>
        <video-publisher bind:this={publisher}></video-publisher>
      </fieldset>
      <button id="video-toggle"  on:click={toggleVideo}>toggle Video</button>
      <button id="audio-toggle"  on:click={toggleAudio}>toggle Audio</button>
    </section>
    <section id="subscribers-container">
      <fieldset>
        <legend>Subscribers</legend>
        <video-subscribers bind:this={subscribers}></video-subscribers>
      </fieldset>
    </section>
  </main>
</div>

<style>
  #video-chat-container {
    display: flex;
    width: 100%;
  }

  #publisher-container {
    width: 400px;
  }

  #subscribers-container {
    width: 100%;
  }

  video-publisher {
    display: block;
    aspect-ratio: 16/9;
  }

  video-subscribers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    place-items: center;
  }

  header {
    text-align: center;
    width: 100%;
  }
  
  img {
    height: 50px;
  }
</style>

<script setup>
  import { ref, onBeforeMount } from 'vue'
  import '@vonage/video-publisher/video-publisher.js';
  import '@vonage/video-subscribers/video-subscribers.js';

  let serverURL;
  let applicationId = 'YOUR_APPLICATION_ID';
  let sessionId = 'YOUR_SESSION_ID';
  let token = 'YOUR_TOKEN';

  // Get references to Web Components
  const publisher = ref(null);
  const subscribers = ref(null);

  function initializeSession() {
    const session = OT.initSession(applicationId, sessionId);
    // Set session and token (and optionally properties) for Web Components  
    if (publisher.value) {
      publisher.value.session = session;
      publisher.value.token = token;
      publisher.value.properties = {
        fitMode: 'cover',
        height: '100%',
        resolution: '1920x1080',
        videoContentHint: 'detail',
        width: '100%',
      };
    } else {
      console.log('Publisher Web Component reference is not available yet.');
    }
    if (subscribers.value) {
      subscribers.value.session = session;
      subscribers.value.token = token;
    } else {
      console.log('Subscribers Web Component reference is not available yet.');
    }
  }


  // Lifecycle: beforeMount
  onBeforeMount(() => {
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

  function toggleVideo() {
    publisher.value.toggleVideo();
  }

  function toggleAudio() {
    publisher.value.toggleAudio();
  }

</script>

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="video-chat-container">
      <section id="publisher-container">
        <fieldset>
          <legend>Publisher</legend>
          <video-publisher ref="publisher"></video-publisher>
        </fieldset>
        <button type="button" @click="toggleVideo">toggle Video</button>
        <button type="button" @click="toggleAudio">toggle Audio</button>
      </section>
      <section id="subscribers-container">
        <fieldset>
          <legend>Subscribers</legend>
          <video-subscribers ref="subscribers"></video-subscribers>
        </fieldset>
      </section>
    </div>
  </div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

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

</style>

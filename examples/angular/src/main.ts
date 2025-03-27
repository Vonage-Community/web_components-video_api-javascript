import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <div id="video-chat-container">
      <section id="publisher-container">
        <fieldset>
          <legend>Publisher</legend>
          <video-publisher #publisher [session]="session" [token]="token" [properties]="pubProperties"></video-publisher>
        </fieldset>
        <button type="button" (click)="toggleVideo()">toggle Video</button>
        <button type="button" (click)="toggleAudio()">toggle Audio</button>
      </section>
      <section id="subscribers-container">
        <fieldset>
          <legend>Subscribers</legend>
          <video-subscribers #subscribers [session]="session" [token]="token"></video-subscribers>
        </fieldset>
      </section>
    </div>
  `,
  styles: `
  p {
    font-family: Lato;
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
  `,
})

export class App implements OnInit, AfterViewInit {
  name = 'Angular';
  serverURL: string|undefined;
  applicationId = 'YOUR_APPLICATION_ID';
  sessionId = 'YOUR_SESSION_ID';
  token = 'YOUR_TOKEN';
  // @ts-ignore
  OT = window.OT;
  session = {};
  pubProperties = {
    fitMode: 'cover',
    height: '100%',
    resolution: '1920x1080',
    videoContentHint: 'detail',
    width: '100%',
  };

  @ViewChild('publisher') publisherComponent!: ElementRef;
  @ViewChild('subscribers') subscribersComponent!: ElementRef;

  initializeSession() {
    // Initialize a Vonage Video Session object
    this.session = this.OT.initSession(this.applicationId, this.sessionId);
  }
  
  toggleVideo() {
    this.publisherComponent?.nativeElement.toggleVideo();
  }

  toggleAudio() {
    this.publisherComponent?.nativeElement.toggleAudio();
  }

  ngOnInit() {
    console.log('ngOnInit');
  }
  
  ngAfterViewInit() {
    if (this.serverURL){
      console.log("serverURL: ", this.serverURL);
      const fetchCredentials = async () => {
        try {
          const response = await fetch(this.serverURL+ '/session');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const credentials = await response.json();
          console.log("credentials: ",credentials);
          this.applicationId = credentials.applicationId;
          this.sessionId = credentials.sessionId;
          this.token = credentials.token;
          this.initializeSession();
        } catch (err:any) {
          console.error('Error getting credentials: ', err.message);
        }
      };
      fetchCredentials();
    } else {
      this.initializeSession();
    }

  }
  
}

bootstrapApplication(App);

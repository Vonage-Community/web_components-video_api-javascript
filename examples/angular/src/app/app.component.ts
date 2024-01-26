import {
  Component,
  VERSION,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import '@vonage/video-publisher/video-publisher.js';
import '@vonage/video-subscribers/video-subscribers.js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  name = 'Angular ' + VERSION.major;
  // These values normally come from a Video API backend SDK in a production application, but for this demo, they are hardcoded
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

  @ViewChild('publisher') publisherComponent: ElementRef;
  @ViewChild('subscribers') subscribersComponent: ElementRef;

  toggleVideo() {
    this.publisherComponent.nativeElement.toggleVideo();
  }

  toggleAudio() {
    this.publisherComponent.nativeElement.toggleAudio();
  }

  ngOnInit() {
    console.log('ngOnInit');
  }
  
  ngAfterViewInit() {
    // Initialize a Vonage Video Session object
    this.session = this.OT.initSession(this.applicationId, this.sessionId);
  }
  
}

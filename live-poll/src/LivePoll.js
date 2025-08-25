import { html, css, LitElement } from 'lit';

export class LivePoll extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--live-poll-text-color, #000);
    }
  `;

  static properties = {
    session: { type: Object },
    token: { type: String },
  };

  constructor() {
    super();
    this.session = {};
    this.token = '';
  }

  connectedCallback() {
    super.connectedCallback();
    if (!window.OT){
      console.error("Please load Vonage Video API library.");
    }
  }

  updated(changedProperties) {
    if(changedProperties.get("session")){
      this.session.connect(this.token, function(error) {
        if (error) {
          console.error("Error connection to session: ",error);
        }
      });

      this.session.on('signal:poll-start', (event) => {
        console.log('signal:poll-start: ', event);
        const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        console.log("owner: ", owner);
      });

      this.session.on('signal:poll-stop', (event) => {
        console.log('signal:poll-stop: ', event);
        // const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        console.log("owner: ", owner);
      });

      this.session.on('signal:poll-reset', (event) => {
        console.log('signal:poll-reset: ', event);
        const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        console.log("owner: ", owner);
      });

      this.session.on('signal:poll-vote', (event) => {
        console.log('signal:poll-vote: ', event);
        const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        console.log("owner: ", owner);
      });

    }
  }

  render() {
    return html`
      <h2>${this.header} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}

import { html, css, LitElement } from 'lit';

export class LiveChat extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--live-chat-text-color, #000);
    }
  `;

  static properties = {
    header: { type: String },
    counter: { type: Number },
    session: { type: Object },
    token: { type: String },
    username: { type: String }
  };

  constructor() {
    super();
    this.header = 'Hey there';
    this.counter = 5;
    this.session = {};
    this.token = '';
    this.username = '';
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

      const msgHistory = this.renderRoot?.querySelector('#history');
      this.session.on('signal:msg', (event) => {
        console.log('signal:msg: ', event);
        const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        const msg = document.createElement('p');
        msg.textContent = event.data;
        msg.className = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        msgHistory.appendChild(msg);
        msg.scrollIntoView();
      });
    }
  }


  __increment() {
    this.counter += 1;
  }

  __sendMessage(event) {
    event.preventDefault();
    const msgForm = this.renderRoot?.querySelector("#chat-form");
    if(event.target.msgTxt.value){
      console.log('send message', event.target.msgTxt.value, msgForm);
      
      this.session.signal({
        type: 'msg',
        data: JSON.stringify({text: event.target.msgTxt.value, sender: this.username})
      }, (error) => {
        if (error) {
          handleError(error);
        } else {
          msgForm.reset();
        }
      });
    }

  }

  render() {
    return html`
      <div id="textchat">
        <h1>${this.username}</h1>
        <p id="history"></p>
        <form @submit=${this.__sendMessage} id="chat-form">
          <input type="text" name="msgTxt" placeholder="Input your text here" id="msgTxt"></input>
        </form>
      </div>
    `;
  }
}

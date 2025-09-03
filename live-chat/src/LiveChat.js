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
    session: { type: Object },
    token: { type: String },
    username: { type: String },
    placeholder: { type: String, attribute: 'placeholder' },
    buttonText: { type: String, attribute: 'button-text' },
    showButton: { type: Boolean, attribute: 'show-button'}
  };

  constructor() {
    super();
    this.session = {};
    this.token = '';
    this.username = '';
    this.placeholder = 'Input your text here!';
    this.chatButtonText = 'send';
    this.showButton = false;
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
        console.log("owner: ", owner);
        const msgContainer = document.createElement('div');
        msgContainer.part.add("message", `${owner}`);
        msgContainer.classList.add("message", `${owner}`);
        const msgText = document.createElement('p');
        msgText.part.add("message-text", `${owner}`);
        msgText.classList.add("message-text", `${owner}`);
        msgText.textContent = message.text;
        const msgSender = document.createElement('p');
        msgSender.part.add("message-sender", `${owner}`);
        msgSender.classList.add("message-sender", `${owner}`);
        msgSender.textContent = message.sender;
        msgContainer.appendChild(msgText);
        msgContainer.appendChild(msgSender);
        msgHistory.appendChild(msgContainer);
        msgContainer.scrollIntoView();
      });
    }
  }

  __sendMessage(event) {
    event.preventDefault();
    const msgForm = this.renderRoot?.querySelector("#form");
    if(event.target.msgTxt.value && event.target.msgTxt.value.trim().length !== 0){
      console.log('send message', event.target.msgTxt.value);
      
      this.session.signal({
        type: 'msg',
        data: JSON.stringify({text: event.target.msgTxt.value, sender: this.username})
      }, (error) => {
        if (error) {
          console.error("Error sending message",error);
        } else {
          msgForm.reset();
        }
      });
    }

  }

  render() {
    return html`
      <div id="container" part="container">
        <p id="history" part="history"></p>
        <form @submit=${this.__sendMessage} id="form" part="form">
          <input type="text" name="msgTxt" placeholder="${this.placeholder}" id="msgTxt" part="input"></input>
          ${this.showButton
            ? html`<button type="submit" part="button">${this.buttonText}</button>`
            : html``
          }
        </form>
      </div>
    `;
  }
}

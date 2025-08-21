import { html, css, LitElement } from 'lit';

export class LivePollControl extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--live-poll-control-text-color, #000);
    }
  `;

  static properties = {
    session: { type: Object },
    token: { type: String },
    pollStarted: { type: Boolean },
    startButtonText: { type: String },
    stopButtonText: { type: String },
    removeButtonText: { type: String },
    placeholder: { type: String },
    inputButtonText: { type: String },
    options: { type: Array }
  };

  constructor() {
    super();
    this.session = {};
    this.token = '';
    this.pollStarted = false;
    this.options = [];
    this.startButtonText = 'start poll';
    this.stopButtonText = 'stop poll';
    this.placeholder = 'enter option';
    this.inputButtonText = 'add option';
    this.removeButtonText = 'remove';
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
        console.log('signal:poll-start: ', event);
        const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        console.log("owner: ", owner);
      });

      this.session.on('signal:poll-reset', (event) => {
        console.log('signal:poll-start: ', event);
        const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        console.log("owner: ", owner);
      });

      this.session.on('signal:poll-vote', (event) => {
        console.log('signal:poll-start: ', event);
        const message = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        console.log("owner: ", owner);
      });

    }
  }

  __addOption(event) {
    event.preventDefault();
    const optionForm = this.renderRoot?.querySelector("#form");
    if(event.target.optionTxt.value && event.target.optionTxt.value.trim().length !== 0){
      console.log('add option', event.target.optionTxt.value);
      this.options = [...this.options, event.target.optionTxt.value];   
      optionForm.reset();
    }


  }

  __removeOption(event) {
    this.options = this.options.filter((_, i) => i !== Number(event.target.dataset.index));
  }

  __updateOption(event, index) {
    console.log("update option: ", event.target.value, index);
    const updatedOptions = this.options.slice(); // Create a shallow copy
    updatedOptions[index] = event.target.value;
    this.options = updatedOptions;
    console.log('options: ', this.options);

  }

  __startPoll() {
    console.log('start poll');
    this.pollStarted = true;

  }

  __stopPoll() {
    console.log('stop poll');
    this.pollStarted = false;


  }

  __resetPoll() {
    console.log('reset poll');

  }



  render() {
    return html`
      <div id="container" part="container">
        <ul id="options" part="options">
          ${this.options.map(
            (option, index) => html`
                <li><input .value="${option}" ?disabled=${this.pollStarted} @input=${(e) => this.__updateOption(e, index)}></input><button @click=${this.__removeOption} ?disabled=${this.pollStarted} data-index="${index}" data-option="${option}" part="remove-button">${this.removeButtonText}</button></li>
              `
          )}
        </ul>
        <form @submit=${this.__addOption} id="form" part="form">
          <input type="text" name="optionTxt" placeholder="${this.placeholder}" id="optionTxt" part="input" ?disabled=${this.pollStarted}></input>
          <button type="submit" ?disabled=${this.pollStarted}>${this.inputButtonText}</button>
        </form>
        ${
          this.pollStarted
            ? html`<button @click=${this.__stopPoll} ?disabled=${!this.pollStarted} part="stop-button">${this.stopButtonText}</button>`
            : html`<button @click=${this.__startPoll} ?disabled=${this.pollStarted} part="start-button">${this.startButtonText}</button>`          
        }
      <div>
    `;
  }
}

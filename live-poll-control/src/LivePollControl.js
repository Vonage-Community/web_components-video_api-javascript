import { html, css, LitElement } from 'lit';
import {live} from 'lit/directives/live.js';

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
    pollTitleText: { type: String },
    pollTitlePlaceholder: { type: String },
    pollStarted: { type: Boolean },
    startButtonText: { type: String },
    stopButtonText: { type: String },
    resetButtonText: { type: String },
    closeButtonText: { type: String },
    removeButtonText: { type: String },
    placeholder: { type: String },
    inputButtonText: { type: String },
    options: { type: Array },
    totalVotes: { type: Number }
  };

  constructor() {
    super();
    this.session = {};
    this.token = '';
    this.pollTitleText = '';
    this.pollTitlePlaceholder = 'enter poll title';
    this.pollStarted = false;
    this.options = [];
    this.startButtonText = 'start poll';
    this.stopButtonText = 'stop poll';
    this.resetButtonText = 'reset poll';
    this.closeButtonText = 'close poll';
    this.placeholder = 'enter option';
    this.inputButtonText = 'add option';
    this.removeButtonText = 'remove';
    this.totalVotes = 5;
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

  __addOption(event) {
    event.preventDefault();
    const optionForm = this.renderRoot?.querySelector("#form");
    if(event.target.optionTxt.value && event.target.optionTxt.value.trim().length !== 0){
      console.log('add option', event.target.optionTxt.value);
      this.options = [...this.options, { text: event.target.optionTxt.value, votes:0}];   
      optionForm.reset();
    }


  }

  __removeOption(event) {
    this.options = this.options.filter((_, i) => i !== Number(event.target.dataset.index));
  }

  __updateOption(event, index) {
    console.log("update option: ", event.target.value, index);
    const updatedOptions = this.options.slice(); // Create a shallow copy
    updatedOptions[index].text = event.target.value;
    this.options = updatedOptions;
    console.log('options: ', this.options);

  }

  __startPoll() {
    console.log('start poll');
    this.session.signal({
      type: 'poll-start',
      data: JSON.stringify({title: this.pollTitleText, options: this.options})
    }, (error) => {
      if (error) {
        console.error('Error starting poll: ',error);
      } else {
        this.pollStarted = true;
      }
    });

  }

  __stopPoll() {
    console.log('stop poll');
    this.session.signal({
      type: 'poll-stop'
    }, (error) => {
      if (error) {
        console.error('Error stopping poll: ',error);
      } else {
        this.pollStarted = false;
      }
    });


  }

  __resetPoll() {
    this.session.signal({
      type: 'poll-reset',
      data: JSON.stringify({title: this.pollTitleText, options: this.options})
    }, (error) => {
      if (error) {
        console.error('Error starting poll: ',error);
      } else {
        const resettedPoll = this.options.slice();
        resettedPoll.map((option) => {
          option.votes = 0;
        });
        this.options = resettedPoll;
      }
    });
  }


  __closePoll() {
    this.session.signal({
      type: 'poll-close'
    }, (error) => {
      if (error) {
        console.error('Error starting poll: ',error);
      } else {
        this.pollStarted = false;
      }
    });
  }


  render() {
    return html`
      <div id="container" part="container">
        <h1>${this.pollTitleText}</h1>
        <input .value="${live(this.pollTitleText)}" @input=${(e) => this.pollTitleText = e.target.value} ?disabled=${this.pollStarted} placeholder="${this.pollTitlePlaceholder}" id="poll-title" name="poll-title-input" part="poll-title-input"></input>
        <ul id="options" part="options">
          ${this.options.map(
            (option, index) => html`
                <li part="option">
                  <input .value="${option.text}" ?disabled=${this.pollStarted} @input=${(e) => this.__updateOption(e, index)} id="option-text-${index}" name="option-text-${index}"></input><button @click=${this.__removeOption} ?disabled=${this.pollStarted} data-index="${index}" data-option="${option}" part="remove-button">${this.removeButtonText}</button>
                  <progress id="option-progress-${index}" name="option-progress-${index}" value="${this.totalVotes === 0 ? 0 : (option.votes / this.totalVotes) * 100}" max="100">${this.totalVotes === 0 ? 0 : (option.votes / this.totalVotes) * 100} %</progress><output name="option-result-${index}" for="option-progress-${index}">${option.votes}</output>
                </li>
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
        <button @click=${this.__resetPoll} part="reset-button">${this.resetButtonText}</button>
        <button @click=${this.__closePoll} part="close-button">${this.closeButtonText}</button>
      <div>
    `;
  }
}

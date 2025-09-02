import { html, css, LitElement } from 'lit';
import {live} from 'lit/directives/live.js';

export class LivePollControl extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--live-poll-control-text-color, #000);
    }
    li:nth-child(odd) {
      background-color: var(--live-poll-control-nth-child-odd-color, Field);
    }
    li:nth-child(even) {
      background-color: var(--live-poll-control-nth-child-even-color, AccentColor);
    }
  `;

  static properties = {
    session: { type: Object },
    token: { type: String },
    pollTitleText: { type: String, attribute: 'title-text' },
    pollTitlePlaceholder: { type: String, attribute: 'title-placeholder' },
    pollStarted: { type: Boolean },
    startButtonText: { type: String, attribute: 'start-button-text' },
    stopButtonText: { type: String, attribute: 'stop-button-text' },
    resetButtonText: { type: String, attribute: 'reset-button-text' },
    closeButtonText: { type: String, attribute: 'close-button-text' },
    removeButtonText: { type: String, attribute: 'remove-button-text' },
    placeholder: { type: String, attribute: 'placeholder' },
    inputButtonText: { type: String, attribute: 'input-button-text' },
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
    this.totalVotes = 0;
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
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
      });

      this.session.on('signal:poll-stop', (event) => {
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
      });

      this.session.on('signal:poll-reset', (event) => {
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
      });

      this.session.on('signal:poll-close', (event) => {
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
      });

      this.session.on('signal:poll-vote', (event) => {
        const vote = JSON.parse(event.data);
        this.options[vote.selectedOption].votes += 1;
        this.totalVotes += 1;
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
      });

    }
  }

  __addOption(event) {
    event.preventDefault();
    const optionForm = this.renderRoot?.querySelector("#form");
    if(event.target.optionTxt.value && event.target.optionTxt.value.trim().length !== 0){
      this.options = [...this.options, { text: event.target.optionTxt.value, votes:0}];   
      optionForm.reset();
    }


  }

  __removeOption(event) {
    this.options = this.options.filter((_, i) => i !== Number(event.target.dataset.index));
  }

  __updateOption(event, index) {
    const updatedOptions = this.options.slice(); // Create a shallow copy
    updatedOptions[index].text = event.target.value;
    this.options = updatedOptions;
  }

  __startPoll() {
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
        this.totalVotes = 0;
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
        <h1 id="title-preview" part="title-preview">${this.pollTitleText}</h1>
        <input .value="${live(this.pollTitleText)}" @input=${(e) => this.pollTitleText = e.target.value} ?disabled=${this.pollStarted} placeholder="${this.pollTitlePlaceholder}" id="poll-title" name="poll-title-input" part="input title"></input>
        <ul id="options" part="options">
          ${this.options.map(
            (option, index) => html`
                <li part="option">
                  <input .value="${option.text}" ?disabled=${this.pollStarted} @input=${(e) => this.__updateOption(e, index)} id="option-text-${index}" name="option-text-${index}" part="option-input"></input><button @click=${this.__removeOption} ?disabled=${this.pollStarted} data-index="${index}" data-option="${option}" part="button remove">${this.removeButtonText}</button>
                  <progress id="option-progress-${index}" name="option-progress-${index}" value="${this.totalVotes === 0 ? 0 : (option.votes / this.totalVotes) * 100}" max="100" part="option-progress">${this.totalVotes === 0 ? 0 : (option.votes / this.totalVotes) * 100} %</progress><output name="option-result-${index}" for="option-progress-${index}" part="option-output">${option.votes}</output>
                </li>
              `
          )}
        </ul>
        <form @submit=${this.__addOption} id="form" part="form">
          <input type="text" name="optionTxt" placeholder="${this.placeholder}" id="optionTxt" part="input option" ?disabled=${this.pollStarted}></input>
          <button type="submit" ?disabled=${this.pollStarted} part="button option">${this.inputButtonText}</button>
        </form>
        ${
          this.pollStarted
            ? html`<button @click=${this.__stopPoll} ?disabled=${!this.pollStarted} part="button stop">${this.stopButtonText}</button>`
            : html`<button @click=${this.__startPoll} ?disabled=${this.pollStarted} part="button start">${this.startButtonText}</button>`          
        }
        <button @click=${this.__resetPoll} part="button reset">${this.resetButtonText}</button>
        <button @click=${this.__closePoll} part="button close">${this.closeButtonText}</button>
      <div>
    `;
  }
}

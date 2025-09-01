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
    poll: { type: Object },
    stopVote: { type: Boolean },
    buttonText: { type: String },
    selectedOption: { type: Number },
    totalVotes: { type: Number }
  };

  constructor() {
    super();
    this.session = {};
    this.token = '';
    this.poll = {};
    this.stopVote = true;
    this.buttonText = 'vote';
    this.selectedOption = 0;
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
        this.poll = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        this.stopVote = false;
        const options = {
          detail: {
            status: 'started',
          },
          bubbles: true,
          composed: true,
        };
        this.dispatchEvent(new CustomEvent('poll-status', options));

      });

      this.session.on('signal:poll-stop', (event) => {
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        this.stopVote = true;
        const options = {
          detail: {
            status: 'stopped',
          },
          bubbles: true,
          composed: true,
        };
        this.dispatchEvent(new CustomEvent('poll-status', options));
      });

      this.session.on('signal:poll-reset', (event) => {
        this.totalVotes = 0;
        this.poll = JSON.parse(event.data);
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        const options = {
          detail: {
            status: 'resetted',
          },
          bubbles: true,
          composed: true,
        };
        this.dispatchEvent(new CustomEvent('poll-status', options));
      });

      this.session.on('signal:poll-vote', (event) => {
        const vote = JSON.parse(event.data);
        this.poll.options[vote.selectedOption].votes += 1;
        this.totalVotes += 1;
        this.requestUpdate()
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        if (owner === 'mine'){
          this.stopVote = true;
        }
        const options = {
          detail: {
            status: 'vote',
            owner
          },
          bubbles: true,
          composed: true,
        };
        this.dispatchEvent(new CustomEvent('poll-status', options));
      });

      this.session.on('signal:poll-close', (event) => {
        const owner = event.from.connectionId === this.session.connection.connectionId ? 'mine' : 'theirs';
        const options = {
          detail: {
            status: 'closed',
          },
          bubbles: true,
          composed: true,
        };
        this.dispatchEvent(new CustomEvent('poll-status', options));
      });


    }
  }

  __vote() {
    this.stopVote = true;
    this.session.signal({
      type: 'poll-vote',
      data: JSON.stringify({selectedOption: this.selectedOption})
    }, (error) => {
      if (error) {
        console.error('Error sending vote: ', error);
        this.stopVote = false
      } else {
        this.stopVote = true;
      }
    });
  }


  render() {
    return html`
      <div part="container">
        <p part="title">${this.poll.title}</p>
        <div part="options">
          ${this.poll.options?.map(
            (option, index) => html`
                <div part="option">
                  <input type="radio" @click=${(e) => this.selectedOption = index} .value="${option.text}" id="option-text-${index}" name="option" ?disabled=${this.stopVote} part="radio" /><label for="option-text-${index}" part="label">${option.text}</label>
                  <progress id="option-progress-${index}" name="option-progress-${index}" value="${this.totalVotes === 0 ? 0 : (option.votes / this.totalVotes) * 100}" max="100" part="progress">${this.totalVotes === 0 ? 0 : (option.votes / this.totalVotes) * 100} %</progress><output name="option-result-${index}" for="option-progress-${index}" part="output">${option.votes}</output>
                </div>
              `
          )}
        </div>
        <button @click=${this.__vote} ?disabled=${this.stopVote} part="button" >${this.buttonText}</button>
      </div>
    `;
  }
}

import { LitElement, html, css } from "lit";

export class WhiteBoard extends LitElement {
  static get properties() {
    return {
      selectedTool: { type: String },
      strokeSize: { type: Number },
      isSourceSelected: { type: Boolean },
      isSharing: { type: Boolean },
      publisher: {},
      session: {},
      token: {},
      properties: { type: Object },
      text: { type: Object },
    }
  };

  static get styles() {
    return css`
      #canvas-container {
        display: grid;
      }

      #canvas-container > * {
        grid-area: 1 / 1;
      }

      #canvas,
      #video-canvas,
      #merged-canvas {
        border: 1px solid grey;
        /*   height: 60vh; */
        height: 100%;
        width: 100%;
        aspect-ratio: 16 / 9;
      }

      #tools-container {
        text-align: center;
      }

      #video,
      #whiteboard {
        display: none;
      }

    `;

  }
  constructor() {
    super();
    this.count = 0;
    this.canvas;
    this.ctx;
    this.videoCanvas;
    this.mergedCanvas;
    this.toolSelect;
    this.selectedTool;
    this.shapes = ['rectangle', 'circle', 'triangle'];
    this.colorInput;
    this.fillInColor;
    this.selectedColor;
    this.strokeInput;
    this.strokeSize;
    this.isDrawing = false;
    this.isSourceSelected = false;
    this.isSharing = false;
    this.prevXpos;
    this.prevYpos;
    this.snapshot;

    this.videoEl;

    this.rafId;
    this.text = [];
    this.textDefault = {
      tools : 'Tools:',
      pen : 'Pen',
      text : 'Text',
      eraser : 'Eraser',
      rectangle : 'Rectangle',
      circle : 'Circle',
      triangle : 'Triangle',
      fillInColor : 'Fill in Color',
      size : 'Size:',
      selectImage : 'Select Image:',
      clear : 'clear',
      save : 'save',
      clearSource : 'clear source',
      selectSource : 'select source',
      startSharing: 'start sharing',
      stopSharing: 'stop sharing'
    };

    this.isResized = false;
    this.resizeObserver = new ResizeObserver(this._handleResize);
  }


  _handleResize = (e) => {
    this.isResized = true;
    if (this.canvas.width !== 0 && this.canvas.height !== 0){
      this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.videoCanvas.width = this.canvas.offsetWidth;
    this.videoCanvas.height = this.canvas.offsetHeight;
    this.mergedCanvas.width = this.canvas.offsetWidth;
    this.mergedCanvas.height = this.canvas.offsetHeight;
    if (this.snapshot){
      this.ctx.putImageData(this.snapshot, 0, 0);
    }

    if (!this.isSourceSelected){
      this.videoCtx.fillStyle = '#fff';
      this.videoCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

  }

  updated(changedProperties) {
    if(changedProperties.get("session")){
      this.session.connect(this.token);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.publisher){
      this.publisher.destroy();
    }
  }

  firstUpdated() {
    super.firstUpdated();
    this.text = {...this.textDefault, ...this.text};
    this.canvas = this.renderRoot?.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.videoCanvas = this.renderRoot?.querySelector("#video-canvas");
    this.videoCtx = this.videoCanvas.getContext("2d", { willReadFrequently: true });
    this.mergedCanvas = this.renderRoot?.querySelector("#merged-canvas");
    this.mergedCtx = this.mergedCanvas.getContext("2d", { willReadFrequently: true });

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.videoCanvas.width = this.canvas.offsetWidth;
    this.videoCanvas.height = this.canvas.offsetHeight;
    this.mergedCanvas.width = this.canvas.offsetWidth;
    this.mergedCanvas.height = this.canvas.offsetHeight;

    this.videoCtx.fillStyle = '#fff';
    this.videoCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.toolSelect = this.renderRoot?.querySelector("#tool-select");
    this.selectedTool = this.toolSelect.value;

    this.colorInput = this.renderRoot?.querySelector("#color");
    this.selectedColor = this.colorInput.value;

    this.fillInColor = this.renderRoot?.querySelector("#fill-in-color");

    this.strokeInput = this.renderRoot?.querySelector("#stroke-input");
    this.strokeSize = this.strokeInput.value;

    this.imageSelect = this.renderRoot?.querySelector("#select-image");

    this.videoEl = this.renderRoot?.querySelector("#video");

    this.resizeObserver.observe(this.canvas);

    this.rafId = requestAnimationFrame(this.drawFrame);
  }

  changeTool(e) {
    this.selectedTool = e.target.value;
  }

  changeColor(e) {
    this.selectedColor = e.target.value;
  }

  changeSize(e) {
    this.strokeSize = e.target.value;
  }

  selectImage(e) {
    this.isDrawing = false;
    const path = URL.createObjectURL(e.target.files[0]);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(
        this.canvas.width / img.width,
        this.canvas.height / img.height
      );
      const x = this.canvas.width / 2 - (img.width / 2) * scale;
      const y = this.canvas.height / 2 - (img.height / 2) * scale;
      this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    };
    img.onerror = function () {
      alert(img.src + ' failed to load.');
    };
    img.src = path;
  }

  clearCanvas() {
    this.ctx.fillStyle = "#fff";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.imageSelect.value = null;
    this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  saveCanvas() {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    if (this.isSourceSelected) {
      let videoData = this.videoCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const mergedData = this.mergeCanvases(this.snapshot, videoData);
      this.mergedCtx.putImageData(mergedData, 0, 0);
      link.href = this.mergedCanvas.toDataURL();
    } else {
      this.videoCtx.fillStyle = '#fff';
      this.videoCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      let videoData = this.videoCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const mergedData = this.mergeCanvases(this.snapshot, videoData);
      this.mergedCtx.putImageData(mergedData, 0, 0);
      link.href = this.mergedCanvas.toDataURL();
    }
    link.click();
  }

  mergeCanvases(top, bottom) {
    const tD = top.data;
    const bD = bottom.data;
    const l = tD.length;
    for (let i = 0; i < l; i += 4) {
      const alphaSrc = tD[i + 3] / 255;
      const alphaDst = bD[i + 3] / 255;
      const alphaSrcO = 1 - alphaSrc;
      const alpha = alphaSrc + alphaDst * alphaSrcO;
      (bD[i] = (tD[i] * alphaSrc + bD[i] * alphaDst * alphaSrcO) / alpha),
        (bD[i + 1] =
          (tD[i + 1] * alphaSrc + bD[i + 1] * alphaDst * alphaSrcO) / alpha),
        (bD[i + 2] =
          (tD[i + 2] * alphaSrc + bD[i + 2] * alphaDst * alphaSrcO) / alpha),
        (bD[i + 3] = 255 * alpha);
    }
    return bottom;
  }

  drawFrame = () => {
    if (this.canvas.width !== 0 && this.canvas.height !== 0){
      const whiteboardData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.videoCtx.drawImage(this.videoEl, 0, 0, this.videoCanvas.width, this.videoCanvas.height);
      const videoData = this.videoCtx.getImageData(0, 0, this.videoCanvas.width, this.videoCanvas.height);
      const mergedData = this.mergeCanvases(whiteboardData, videoData);
      this.mergedCtx.putImageData(mergedData, 0, 0);
    }
    this.rafId = requestAnimationFrame(this.drawFrame);
  }

  startDrawing(e) {
    if(this.isResized){
      this.isResized = false;
    }
    this.isDrawing = true;
    this.prevXpos = e.offsetX;
    this.prevYpos = e.offsetY;
    this.ctx.beginPath();
    this.ctx.lineWidth = this.strokeSize;
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.fillStyle = this.selectedColor;
    if (!this.isSourceSelected) {
      this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  placeText(e) {
    if (this.selectedTool === 'text') {
      const textXPos = e.clientX;
      const textYPos = e.clientY;
      const textInput = document.createElement('input');

      textInput.setAttribute('type', 'text');
      textInput.style.position = 'fixed';
      textInput.style.top = e.clientY + 'px';
      textInput.style.left = e.clientX + 'px';
      textInput.style.background = 'rgba(255,255,255, .5)';
      textInput.style.width = '100px';
      textInput.style.maxWidth = '200px';
      textInput.style.border = '1px dashed red';
      textInput.style.fontSize = '16px';
      textInput.style.color = self.userColor;
      textInput.style.fontFamily = 'Arial';
      textInput.style.zIndex = '1001';

      this.renderRoot?.querySelector('#canvas-container').appendChild(textInput);
      textInput.focus();

      textInput.addEventListener('keydown', (event) => {
        if (event.which === 13) {
          const { x, y } = this.renderRoot?.querySelector('#canvas').getBoundingClientRect();
          this.ctx.font = `${this.strokeSize * 10}px serif`;
          this.ctx.fillStyle = this.selectedColor;
          this.ctx.fillText(textInput.value, textXPos - x, textYPos - y);
          this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          textInput.remove();
          return;
        }
      });
      textInput.addEventListener('blur', () => {});
    }

  }

  drawRectangle(e) {
    this.ctx.strokeStyle = this.selectedColor;
    if (!this.fillInColor.checked) {
      this.ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        this.prevXpos - e.offsetX,
        this.prevYpos - e.offsetY
      );
    } else {
      this.ctx.fillRect(
        e.offsetX,
        e.offsetY,
        this.prevXpos - e.offsetX,
        this.prevYpos - e.offsetY
      );
    }
  }

  drawCircle(e) {
    this.ctx.beginPath();
    let radius = Math.sqrt(
      Math.pow(this.prevXpos - e.offsetX, 2) + Math.pow(this.prevYpos - e.offsetY, 2)
    );
    this.ctx.arc(this.prevXpos, this.prevYpos, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.fillInColor.checked ? this.ctx.fill() : this.ctx.stroke();
  }

  drawTriangle(e) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevXpos, this.prevYpos);
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.lineTo(this.prevXpos * 2 - e.offsetX, e.offsetY);
    this.ctx.closePath();
    this.fillInColor.checked ? this.ctx.fill() : this.ctx.stroke();
  }

  continueDrawing(e) {
    if (!this.isDrawing) return;
    this.ctx.putImageData(this.snapshot, 0, 0);

    switch (this.selectedTool) {
      case "pen":
      case "eraser":
        this.ctx.strokeStyle = this.selectedTool === 'eraser' ? '#fff' : this.selectedColor;
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
        break;
      case "rectangle":
        this.drawRectangle(e);
        break;
      case "circle":
        this.drawCircle(e);
        break;
      case "triangle":
        this.drawTriangle(e);
        break;
    }

  }

  stopDrawing() {
    this.isDrawing = false;
    this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  async selectSource() {
    try {
      this.videoEl.srcObject = await navigator.mediaDevices.getDisplayMedia();
      this.isSourceSelected = true;
      this.rafId = requestAnimationFrame(this.drawFrame);
    } catch (error) {
      console.error(error);
    }
  }

  clearSource() {
    const tracks = this.videoEl.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    this.isSourceSelected = false;
    this.videoEl.srcObject = null;
    this.videoCtx.fillStyle = '#fff';
    this.videoCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  }

  startSharing() {
    if (!this.isSourceSelected){
      this.videoCtx.fillStyle = '#fff';
      this.videoCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.properties = { ...this.properties, audioSource: false, videoSource: this.mergedCanvas.captureStream(30).getVideoTracks()[0], insertMode: 'append'};
    if (window.OT){
      this.publisher = OT.initPublisher(document.querySelector('white-board'), this.properties, (error) => {
        if(error){
          console.error("error: ", error)
        } else {
          this.session.publish(this.publisher, (pubError) => {
            if(pubError){
              console.error("session error: ", pubError.message);
            } else {
              this.isSharing = true;
            }
          });
        }
      });
    } else {
      console.error("Please load Vonage Video library.");
    }
  }

  stopSharing() {
    this.publisher.destroy();
    this.isSharing = false;
  }

  displaySourceButton() {
    if(this.isSourceSelected){
      return html`<button part="tools button deselect" id="clear-source" @click="${this.clearSource}">${this.text.clearSource}</button>`;
    } else {
      return html`<button part="tools button select" id="select-source" @click="${this.selectSource}">${this.text.selectSource}</button>`;
    }
  }

  displaySharingButton() {
    if(this.isSharing){
      return html`<button part="tools button stop" id="stop-sharing" @click="${this.stopSharing}">${this.text.stopSharing}</button>`;
    } else {
      return html`<button part="tools button start" id="start-sharing" @click="${this.startSharing}">${this.text.startSharing}</button>`;
    }
  }

  render() {
    return html`
      <section part="canvas container" id="canvas-container">
        <canvas id="merged-canvas"></canvas>
        <canvas id="video-canvas"></canvas>
        <canvas id="canvas" @mousedown="${this.startDrawing}" @mousemove="${this.continueDrawing}" @mouseup="${this.stopDrawing}" @click="${this.placeText}"></canvas>
      </section>
      <section part="tools container" id="tools-container">
        <label part="tools label text" for="tool-select">${this.text.tools}</label>
        <select part="tools select tool" name="tools" id="tool-select" @change="${this.changeTool}">
          <option part="tools option pen" value="pen">${this.text.pen}</option>
          <option part="tools option text" value="text">${this.text.text}</option>
          <option part="tools option eraser" value="eraser">${this.text.eraser}</option>
          <option part="tools option rectangle" value="rectangle">${this.text.rectangle}</option>
          <option part="tools option circle" value="circle">${this.text.circle}</option>
          <option part="tools option triangle" value="triangle">${this.text.triangle}</option>
        </select>
        &nbsp; | &nbsp; <input part="tools input color" id="color" type="color" @change="${this.changeColor}"/> &nbsp;
        <input part="tools checkbox fill" type="checkbox" id="fill-in-color" name="fill-in-color" ?disabled=${!this.shapes.includes(this.selectedTool)}/>
        <label part="tools label fill" for="fill-in-color">${this.text.fillInColor}</label> &nbsp; | &nbsp;
        <input
          part="tools range stroke"
          id="stroke-input"
          type="range"
          min="1"
          max="10"
          step="1"
          value="5"
          @change="${this.changeSize}"
        />
        <label part="tools label stroke" for="stroke-output">${this.text.size}</label> <output part="tools output stroke" id="stroke-output" name="stroke-output"> ${this.strokeSize} </output> &nbsp; | &nbsp;
        <label part="tools label image" for="select-image">${this.text.selectImage}</label>
        <input
          part="tools file image"
          type="file"
          id="select-image"
          name="select-image"
          accept=".jpg, .jpeg, .png"
          @change="${this.selectImage}"
        />
        &nbsp; | &nbsp;
        <button part="tools button clear"id="clear" @click="${this.clearCanvas}">${this.text.clear}</button>
        <button part="tools button save" id="save" @click="${this.saveCanvas}">${this.text.save}</button>
        <br />
        ${this.displaySourceButton()}
        ${window.OT ? this.displaySharingButton() : ""}
        <video id="video" autoplay></video>
        <div id="whiteboard"></div>
      </section>
    `;
  }
}

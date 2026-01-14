import { LitElement, html, css } from "lit";

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export class WhiteBoard extends LitElement {
  static get properties() {
    return {
      session: { type: Object },
      token: { type: String},
      selectedTool: { type: String },
      strokeSize: { type: Number },
      isSourceSelected: { type: Boolean },
      isSharing: { type: Boolean },
      publisher: {},
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
    this.session = {};
    this.token = '';
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
    this.throttledSignal = throttle(this.sendSignal, 30); // 30ms throttle
    // Track the last known position of every remote user
    // Format: { "connectionId": { x: 0.5, y: 0.5 } }
    this.remoteCursors = {};
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

      this.session.on('signal:wb-draw', (event) => {
        // Ignore our own signals
        if (this.session.connection && event.from.connectionId === this.session.connection.connectionId) return;
        this.handleRemoteSignal(JSON.parse(event.data), event.from.connectionId);
      });

      this.session.on('signal:wb-clear', (event) => {
        // Ignore our own signals
        if (this.session.connection && event.from.connectionId === this.session.connection.connectionId) return;
        this.clearCanvas(true); // true = skip sending signal back
      });
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

  clearCanvas(isRemote = false) {
    this.ctx.fillStyle = "#fff";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.imageSelect.value = null;
    this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    if (!isRemote && this.session) {
      this.session.signal({ type: 'wb-clear', data: '1' });
    }
  }

  saveCanvas() {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    
    // Reset video ctx if needed
    if (!this.isSourceSelected) {
      this.videoCtx.fillStyle = '#fff';
      this.videoCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    let videoData = this.videoCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    // Use current state of canvas (handled by logic below) instead of old snapshot
    const currentBoard = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    const mergedData = this.mergeCanvases(currentBoard, videoData);
    this.mergedCtx.putImageData(mergedData, 0, 0);
    link.href = this.mergedCanvas.toDataURL();
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
      
      // 1. Always get the whiteboard drawing
      const whiteboardData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      // 2. Prepare the background (Video or White)
      if(this.isSourceSelected) {
          // Draw the live video feed
          this.videoCtx.drawImage(this.videoEl, 0, 0, this.videoCanvas.width, this.videoCanvas.height);
      } else {
          // Ensure background is solid white if no video is selected
          // (This is crucial so we don't merge transparency on transparency)
          this.videoCtx.fillStyle = '#fff';
          this.videoCtx.fillRect(0, 0, this.videoCanvas.width, this.videoCanvas.height);
      }

      // 3. Get the background data
      const videoData = this.videoCtx.getImageData(0, 0, this.videoCanvas.width, this.videoCanvas.height);
      
      // 4. Merge them (Whiteboard + Background)
      const mergedData = this.mergeCanvases(whiteboardData, videoData);
      
      // 5. Paint the result to the Publisher's canvas
      this.mergedCtx.putImageData(mergedData, 0, 0);
    }
    
    // Loop
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
    this.sendSignal({
      t: 'down',
      x: e.offsetX / this.canvas.width,
      y: e.offsetY / this.canvas.height,
      c: this.selectedColor,
      s: this.strokeSize,
      tl: this.selectedTool
    });
  }

  continueDrawing(e) {
    if (!this.isDrawing) return;
    
    const x = e.offsetX;
    const y = e.offsetY;

    // Only restore the snapshot (wipe canvas) for Shapes.
    // For Pen/Eraser, we want to KEEP the pixels we just drew.
    if (['rectangle', 'circle', 'triangle'].includes(this.selectedTool)) {
        this.ctx.putImageData(this.snapshot, 0, 0);
    }

    switch (this.selectedTool) {
      case "pen":
      case "eraser":
        this.ctx.strokeStyle = this.selectedTool === 'eraser' ? '#fff' : this.selectedColor;
        this.ctx.lineWidth = this.strokeSize;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        
        // Explicitly start a new path for this segment.
        // This prevents 'handleRemoteSignal' from breaking our path state.
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevXpos, this.prevYpos);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.closePath();
        
        // Send the signal (Throttled)
        this.throttledSignal({
            t: 'move',
            x: x / this.canvas.width,
            y: y / this.canvas.height,
            // We NO LONGER rely on sending 'px/py' here for connectivity.
            // The receiver will handle the gaps.
            c: this.selectedTool === 'eraser' ? '#fff' : this.selectedColor,
            s: this.strokeSize
        });
        
        // Update prevPos for the next segment
        this.prevXpos = x; 
        this.prevYpos = y;
        break;
        
      case "rectangle":
        this.drawRectangle(x, y, this.prevXpos, this.prevYpos);
        break;
      case "circle":
        this.drawCircle(x, y, this.prevXpos, this.prevYpos);
        break;
      case "triangle":
        this.drawTriangle(x, y, this.prevXpos, this.prevYpos);
        break;
    }
  }


  stopDrawing(e) {
    if(!this.isDrawing) return; // safety
    const x = e.offsetX;
    const y = e.offsetY;
    
    // Send Final Shape Signal
    // We do not send real-time rectangle/circle dragging to save bandwidth.
    // We only send the final shape.
    if (['rectangle', 'circle', 'triangle'].includes(this.selectedTool)) {
        this.sendSignal({
            t: 'shape',
            tl: this.selectedTool,
            x: x / this.canvas.width,
            y: y / this.canvas.height,
            px: this.prevXpos / this.canvas.width,
            py: this.prevYpos / this.canvas.height,
            c: this.selectedColor,
            s: this.strokeSize,
            f: this.fillInColor.checked
        });
    } else {
        // Pen Up signal
        this.sendSignal({ t: 'up' });
    }

    this.isDrawing = false;
    // Save state
    this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  // --- DRAWING HELPERS ---
  
  drawRectangle(x, y, startX, startY) {
    this.ctx.lineWidth = this.strokeSize; // Ensure context is current
    if (!this.fillInColor.checked) {
      this.ctx.strokeRect(x, y, startX - x, startY - y);
    } else {
      this.ctx.fillRect(x, y, startX - x, startY - y);
    }
  }

  drawCircle(x, y, startX, startY) {
    this.ctx.lineWidth = this.strokeSize;
    this.ctx.beginPath();
    let radius = Math.sqrt(Math.pow(startX - x, 2) + Math.pow(startY - y, 2));
    this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.fillInColor.checked ? this.ctx.fill() : this.ctx.stroke();
  }

  drawTriangle(x, y, startX, startY) {
    this.ctx.lineWidth = this.strokeSize;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(startX * 2 - x, y);
    this.ctx.closePath();
    this.fillInColor.checked ? this.ctx.fill() : this.ctx.stroke();
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
      textInput.style.color = this.selectedColor;
      textInput.style.fontFamily = 'Arial';
      textInput.style.zIndex = '1001';

      this.renderRoot?.querySelector('#canvas-container').appendChild(textInput);
      textInput.focus();

      textInput.addEventListener('keydown', (event) => {
        if (event.which === 13) {
          const { x, y } = this.renderRoot?.querySelector('#canvas').getBoundingClientRect();
          const relativeX = textXPos - x;
          const relativeY = textYPos - y;
          
          this.ctx.font = `${this.strokeSize * 10}px serif`;
          this.ctx.fillStyle = this.selectedColor;
          this.ctx.fillText(textInput.value, relativeX, relativeY);
          
          // Send Text Signal
          this.sendSignal({
              t: 'text',
              txt: textInput.value,
              x: relativeX / this.canvas.width,
              y: relativeY / this.canvas.height,
              c: this.selectedColor,
              s: this.strokeSize
          });

          this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          textInput.remove();
        }
      });
      textInput.addEventListener('blur', () => textInput.remove());
    }
  }

  // --- SIGNALING CORE ---

  sendSignal(data) {
    if (this.session) {
      this.session.signal({
        type: 'wb-draw',
        data: JSON.stringify(data)
      }, (error) => {
        if (error) console.error("Signal error: " + error.message);
      });
    }
  }

  handleRemoteSignal(data, fromConnectionId) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // Current target coordinates
    const x = data.x * w;
    const y = data.y * h;

    this.ctx.save();
    this.ctx.strokeStyle = data.c;
    this.ctx.fillStyle = data.c;
    this.ctx.lineWidth = data.s;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    if (data.t === 'down') {
        // Just store the starting point. Don't draw yet.
        this.remoteCursors[fromConnectionId] = { x: x, y: y };
    } 
    else if (data.t === 'move') {
        // Retrieve the LAST position we saw for this specific user
        const lastPos = this.remoteCursors[fromConnectionId];
        
        if (lastPos) {
            this.ctx.beginPath();
            this.ctx.moveTo(lastPos.x, lastPos.y);
            
            // Quadratic Curve for smoothness
            const midPointX = (lastPos.x + x) / 2;
            const midPointY = (lastPos.y + y) / 2;
            this.ctx.quadraticCurveTo(lastPos.x, lastPos.y, midPointX, midPointY);
            
            this.ctx.lineTo(x, y); 
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
        // Update their position for the next frame
        this.remoteCursors[fromConnectionId] = { x: x, y: y };
    }
    else if (data.t === 'up') {
        // User finished drawing, clear their cursor history
        delete this.remoteCursors[fromConnectionId];
    }
    else if (data.t === 'shape') {
        // ... (existing shape logic) ...
        const tempCheck = this.fillInColor.checked;
        this.fillInColor.checked = data.f; 
        // Note: For shapes, we still rely on 'px' sent in data because shapes aren't throttled
        // But we need to denormalize px here if you kept it in the payload
        const px = data.px * w; 
        const py = data.py * h;
        
        if(data.tl === 'rectangle') this.drawRectangle(x, y, px, py);
        if(data.tl === 'circle') this.drawCircle(x, y, px, py);
        if(data.tl === 'triangle') this.drawTriangle(x, y, px, py);
        this.fillInColor.checked = tempCheck;
    }
    else if (data.t === 'text') {
        this.ctx.font = `${data.s * 10}px serif`;
        this.ctx.fillText(data.txt, x, y);
    }

    this.ctx.restore();

    // Update snapshot to bake in the remote changes
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
    if(tracks) tracks.forEach((track) => track.stop());
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
        <button part="tools button clear"id="clear" @click="${() => this.clearCanvas(false)}">${this.text.clear}</button>
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

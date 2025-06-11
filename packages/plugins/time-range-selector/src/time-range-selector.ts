/*
 * Copyright 2025 ByOmakase, LLC (https://byomakase.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function secondsToFormattedTime(seconds: number) {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  const secondsUTC = date.getUTCSeconds();

  if (secondsUTC >= 30) {
    minutes++;
  }

  return `${hours}h ${minutes}min`;
}

const style = `
    .omakase-time-range-selector-segments {
      display: flex;
      width: 700px;
      position: relative;
      font-size: 13px;
    }
  
    .omakase-time-range-selector-container {
      max-width: 700px;
      position: relative;
    }
  
    .omakase-time-range-selector-segment {
      flex-grow: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .omakase-time-range-selector-segment-marker {
      background-color: #2E313D;
      border: 1px solid #655372;
      border-right: none;
      width: 100%;
      height: 20px;
    }

    .omakase-time-range-selector-segment:last-of-type .omakase-time-range-selector-segment-marker {
      border-right: 1px solid #655372;
    }
  
    .omakase-time-range-selector-segment-tick {
      width: 100%;
      height: 10px;
      border-left: 1px solid #655372;
      position: relative;
    }
  
    .omakase-time-range-selector-segment:last-child .omakase-time-range-selector-segment-tick {
      border-right: 1px solid #655372;
    }
  
    .omakase-time-range-selector-segment-label {
      font-size: 13px;
      margin-top: 5px;
      white-space: nowrap;
    }
  
    .omakase-time-range-selector-segment:first-child .omakase-time-range-selector-segment-label {
      position: absolute;
      top: 25px;
      left: 0;
    }
  
    .omakase-time-range-selector-segment:not(:first-child) .omakase-time-range-selector-segment-label {
      position: absolute;
      top: 25px;
      left: 0;
      transform: translateX(-50%);
    }
  
    .omakase-time-range-selector-segment:last-child {
      position: relative;
      direction: rtl;
    }
  
    .omakase-time-range-selector-segment:last-child .omakase-time-range-selector-segment-first-label {
      position: absolute;
      top: 25px;
      left: 0;
      transform: translateX(-50%);
    }
  
    .omakase-time-range-selector-segment:last-child .omakase-time-range-selector-segment-second-label {
      position: absolute;
      top: 25px;
      right: -100%;
    }
  
    .omakase-time-range-selector-range-selector {
      height: 20px;
      background-color: #662D91;
      position: absolute;
      cursor: grab;
      width: 300px;
      z-index: 2;
      display: flex;
      justify-content: space-between;
    }
  
    .omakase-time-range-selector-range-selector-handle {
      height: 32px;
      min-width: 4px;
      background-color: #662D91;
      cursor: ew-resize;
      z-index: 2;
    }
  
    .omakase-time-range-selector-range-selector-duration {
      display: flex;
      align-items: center;
      font-size: 13px;
      min-width: 0;
      overflow: hidden;
      text-wrap: nowrap;
      text-overflow: clip;
      color: #ffffff;
      z-index: 3;
    }
  
    .omakase-time-range-selector-range-selector-duration:hover {
      font-size: 13px;
      overflow: visible;
      color: #ffffff;
    }
  
    .omakase-time-range-selector-button-container {
      z-index: 3;
      position: absolute;
      right: 0px;
      top: 10px;
      display: flex;
    }
  
    .omakase-time-range-selector-button-container svg {
      cursor: pointer;
    }
  
    .omakase-time-range-selector-invisible {
      display: none;
    }
  
    .omakase-time-range-selector-button-container button, 
    .omakase-time-range-selector-button-container input[type="submit"], 
    .omakase-time-range-selector-button-container input[type="reset"] {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
      outline: inherit;
    }
  `;

const checkmarkSvg = `
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_d_5782_463)">
  <circle cx="16" cy="12" r="12" fill="#424850"/>
  <g clip-path="url(#clip0_5782_463)">
  <path d="M21.8411 8.37562C21.5993 8.1332 21.2772 8 20.9346 8C20.5921 8 20.2703 8.13348 20.0278 8.37562L14.4994 13.904L12.1886 11.5932C11.6886 11.0932 10.8751 11.0932 10.3751 11.5932C9.87506 12.0932 9.87506 12.9068 10.3751 13.4068L13.5927 16.6244C13.8348 16.8665 14.1569 17 14.4994 17C14.842 17 15.1644 16.8665 15.4062 16.6244L21.8411 10.1892C22.0836 9.94705 22.2168 9.62493 22.2168 9.2824C22.2168 8.93988 22.0836 8.61804 21.8414 8.37562H21.8411Z" fill="#00E9A3"/>
  </g>
  </g>
  <defs>
  <filter id="filter0_d_5782_463" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
  <feOffset dy="4"/>
  <feGaussianBlur stdDeviation="2"/>
  <feComposite in2="hardAlpha" operator="out"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5782_463"/>
  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5782_463" result="shape"/>
  </filter>
  <clipPath id="clip0_5782_463">
  <rect width="12.2168" height="9" fill="white" transform="translate(10 8)"/>
  </clipPath>
  </defs>
  </svg>
  `;

const xSvg = `
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_d_5782_462)">
  <circle cx="16" cy="12" r="12" fill="#424850"/>
  <g clip-path="url(#clip0_5782_462)">
  <path d="M20.6618 8.96972L17.6319 12L20.6618 15.0301C21.1125 15.4809 21.1125 16.2113 20.6618 16.6621C20.4366 16.8873 20.1414 17 19.8463 17C19.5507 17 19.2555 16.8875 19.0305 16.6621L15.9999 13.6317L12.9696 16.6621C12.7444 16.8873 12.4492 17 12.1538 17C11.8586 17 11.5635 16.8875 11.3382 16.6621C10.8875 16.2114 10.8875 15.4811 11.3382 15.03L14.368 11.9999L11.338 8.96972C10.8873 8.51903 10.8873 7.78852 11.338 7.33783C11.7886 6.88749 12.5187 6.88749 12.9694 7.33783L15.9999 10.3681L19.0301 7.33783C19.481 6.88749 20.2111 6.88749 20.6616 7.33783C21.1125 7.78852 21.1125 8.51903 20.6618 8.96972Z" fill="#F03838"/>
  </g>
  </g>
  <defs>
  <filter id="filter0_d_5782_462" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
  <feOffset dy="4"/>
  <feGaussianBlur stdDeviation="2"/>
  <feComposite in2="hardAlpha" operator="out"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5782_462"/>
  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5782_462" result="shape"/>
  </filter>
  <clipPath id="clip0_5782_462">
  <rect width="9.99982" height="10" fill="white" transform="translate(11 7)"/>
  </clipPath>
  </defs>
  </svg>
  
  `;

const classes = {
  container: "omakase-time-range-selector-container",
  segments: "omakase-time-range-selector-segments",
  segment: "omakase-time-range-selector-segment",
  segmentMarker: "omakase-time-range-selector-segment-marker",
  segmentTick: "omakase-time-range-selector-segment-tick",
  segmentLabel: "omakase-time-range-selector-segment-label",
  firstSegmentLabel: "omakase-time-range-selector-segment-first-label",
  secondSegmentLabel: "omakase-time-range-selector-segment-second-label",
  rangeSelector: "omakase-time-range-selector-range-selector",
  rangeSelectorHandle: "omakase-time-range-selector-range-selector-handle",
  rangeSelectorDuration: "omakase-time-range-selector-range-selector-duration",
  buttonContainer: "omakase-time-range-selector-button-container",
  invisible: "omakase-time-range-selector-invisible",
};

const ids = {
  leftHandle: "omakase-time-range-selector-range-selector-left-handle",
  rightHandle: "omakase-time-range-selector-range-selector-right-handle",
  rangeDuration: "omakase-time-range-selector-range-selector-range-duration",
  buttonContainer: "omakase-time-range-selector-button-container",
  segments: "omakase-time-range-selector-segments",
};

export class OmakaseTimeRangeSelector extends HTMLElement {
  private _container!: HTMLDivElement;

  private _rangeSelector!: HTMLDivElement;
  private _rangeSelectorLeftHandle!: HTMLDivElement;
  private _rangeSelectorRightHandle!: HTMLDivElement;
  private _rangeSelectorRangeDisplay!: HTMLDivElement;

  private _buttonContainer!: HTMLDivElement;

  private _segments!: HTMLDivElement;

  private _numberOfSegments = 5;
  private _firstLabelIndex = 0;
  private _initialFirstLabelIndex = 0;
  private _labels: number[] = [];

  public minWidth: number = 10;
  public minValue!: number;
  public maxValue!: number;
  public maxRange!: number;
  public segmentSize!: number;
  public sliderStart!: number;
  public sliderEnd!: number;
  maxWidthPercent!: number;

  public set numberOfSegments(n: number) {
    if (n > 2) {
      this._numberOfSegments = n;
    }
  }

  public get numberOfSegments() {
    return this._numberOfSegments;
  }

  public onCheckmarkClickCallback:
    | ((start: number, end: number) => void)
    | undefined;

  private currentStart: number = 0;
  private currentEnd: number = 100;

  static get observedAttributes() {
    return [
      "minValue",
      "maxValue",
      "maxRange",
      "segmentSize",
      "sliderStart",
      "sliderEnd",
      "numberOfSegments",
    ];
  }

  get firstLabelIndex() {
    return this._firstLabelIndex;
  }

  set firstLabelIndex(newFirstLabelIndex: number) {
    if (
      newFirstLabelIndex + this._numberOfSegments + 1 >=
      this._labels.length
    ) {
      this._firstLabelIndex = this._labels.length - 1 - this.numberOfSegments;
      return;
    }

    if (newFirstLabelIndex < 0) {
      this._firstLabelIndex = 0;
      return;
    }

    this._firstLabelIndex = newFirstLabelIndex;
  }

  get lastLabelIndex() {
    return this._firstLabelIndex + this._numberOfSegments;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.minValue = Number.parseInt(this.getAttribute("minValue") ?? "NaN");
    this.maxValue = Number.parseInt(this.getAttribute("maxValue") ?? "NaN");
    this.maxRange = Number.parseInt(this.getAttribute("maxRange") ?? "NaN");
    this.segmentSize = Number.parseInt(
      this.getAttribute("segmentSize") ?? "NaN"
    );

    if (this.getAttribute("numberOfSegments")) {
      const numberOfSegments = Number.parseInt(
        this.getAttribute("numberOfSegments")!
      );

      if (Number.isNaN(numberOfSegments)) {
        throw new Error("Invalid atribute value");
      }

      this._numberOfSegments = numberOfSegments;
    }

    if (
      Number.isNaN(this.minValue) ||
      Number.isNaN(this.maxValue) ||
      Number.isNaN(this.maxRange) ||
      Number.isNaN(this.segmentSize)
    ) {
      throw new Error("Invalid attribute values.");
    }

    const totalRange = this.maxValue - this.minValue;
    if (totalRange < this.numberOfSegments * this.segmentSize) {
      this.segmentSize = totalRange / this.numberOfSegments;
    }

    this.maxWidthPercent =
      this.maxRange > this.numberOfSegments * this.segmentSize
        ? 1
        : this.maxRange / (this.numberOfSegments * this.segmentSize);

    this._labels = this.calculateLabels();

    if (this.maxValue < this.minValue) {
      throw new Error("Max value is lesser than min value");
    }

    let sliderStart: number;
    let sliderEnd: number;
    if (this.getAttribute("sliderStart") && this.getAttribute("sliderEnd")) {
      sliderStart = Number.parseFloat(this.getAttribute("sliderStart")!);
      sliderEnd = Number.parseFloat(this.getAttribute("sliderEnd")!);

      if (sliderStart > sliderEnd) {
        throw new Error("Slider start is bigger than slider end");
      }

      if (sliderStart < this.minValue) {
        throw new Error("Slider start is smaller than minimal value");
      }

      if (sliderEnd > this.maxValue) {
        sliderEnd = this.maxValue;
      }

      this.currentStart = sliderStart;
      this.currentEnd = sliderEnd;
    } else {
      sliderStart = this.minValue;
      sliderEnd = this.segmentSize;
    }

    this.resolveInitialSegment(sliderStart, sliderEnd);

    this._container = document.createElement("div");
    this._container.classList.add(classes.container);

    const styleComponent = document.createElement("style");
    styleComponent.textContent = style;

    this._container.append(styleComponent);

    this._buttonContainer = document.createElement("div");
    this._buttonContainer.classList.add(
      classes.buttonContainer,
      classes.invisible
    );

    const checkmarkSpan = this.createButtonSvg(checkmarkSvg);
    const xSpan = this.createButtonSvg(xSvg);
    checkmarkSpan.onclick = this.onCheckmarkClick;
    xSpan.onclick = this.onXclick;

    this._buttonContainer.append(checkmarkSpan, xSpan);

    this._container.append(this._buttonContainer);

    this._rangeSelector = document.createElement("div");
    this._rangeSelector.classList.add(classes.rangeSelector);

    this._rangeSelectorLeftHandle = document.createElement("div");
    this._rangeSelectorLeftHandle.classList.add(classes.rangeSelectorHandle);
    this._rangeSelectorLeftHandle.id = ids.leftHandle;

    this._rangeSelectorRightHandle = document.createElement("div");
    this._rangeSelectorRightHandle.classList.add(classes.rangeSelectorHandle);
    this._rangeSelectorRightHandle.id = ids.rightHandle;

    this._rangeSelectorRangeDisplay = document.createElement("div");
    this._rangeSelectorRangeDisplay.classList.add(
      classes.rangeSelectorDuration
    );
    this._rangeSelectorRangeDisplay.id = ids.rangeDuration;

    this._rangeSelector.append(
      this._rangeSelectorLeftHandle,
      this._rangeSelectorRangeDisplay,
      this._rangeSelectorRightHandle
    );

    this._container.append(this._rangeSelector);
    this._segments = this.buildSegments(
      this._labels.slice(this.firstLabelIndex, this.lastLabelIndex + 1)
    );
    this._segments.id = ids.segments;
    this._segments.classList.add(classes.segments);

    this._container.append(this._segments);

    this._rangeSelectorLeftHandle.addEventListener(
      "mousedown",
      this.onMouseDownLeft
    );
    this._rangeSelectorRightHandle.addEventListener(
      "mousedown",
      this.onMouseDownRight
    );
    this._rangeSelector.addEventListener("mousedown", this.onMouseDownDrag);

    this.append(this._container);
    this.initSlider(sliderStart, sliderEnd);

    const { start, end } = this.getSliderValues();
    this.currentStart = start;
    this.currentEnd = end;

    this.updateDuration();
  }

  private resolveInitialSegment(sliderStart: number, sliderEnd: number) {
    const displayableRange = this._numberOfSegments * this.segmentSize;
    const sliderRange = sliderEnd - sliderStart;
    const totalRange = this.maxValue - this.minValue;

    const relativeSliderStart = sliderStart - this.minValue;
    const numberOfLabels = Math.ceil(totalRange / this.segmentSize);
    let proposedSliderStartLabelIndex = Math.floor(
      (relativeSliderStart / totalRange) * numberOfLabels
    );

    proposedSliderStartLabelIndex += Math.floor(
      (displayableRange - sliderRange) / this.segmentSize
    );

    const proposedLastLabelIndex =
      proposedSliderStartLabelIndex + Math.ceil(sliderRange / this.segmentSize);

    const firstLabelIndex = proposedLastLabelIndex - this._numberOfSegments;

    this.firstLabelIndex = firstLabelIndex;

    this._initialFirstLabelIndex = firstLabelIndex;
  }

  private createButtonSvg(innerHTML: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerHTML = innerHTML;

    return button;
  }

  private calculateLabels() {
    const firstLabel = this.minValue;
    const lastLabel = this.maxValue;

    const numberOfLabelsToCreate =
      Math.floor((this.maxValue - this.minValue) / this.segmentSize) - 1;

    const labels = [firstLabel];

    let currentLabelValue = this.minValue;

    for (let index = 0; index < numberOfLabelsToCreate; index++) {
      currentLabelValue += this.segmentSize;
      labels.push(currentLabelValue);
    }

    labels.push(lastLabel);

    return labels;
  }

  private buildSegments(labels: number[]) {
    const segments = document.createElement("div");

    labels.slice(0, -2).forEach((label) => {
      const segment = document.createElement("div");
      segment.classList.add(classes.segment);

      const segmentMarker = document.createElement("div");
      segmentMarker.classList.add(classes.segmentMarker);

      const segmentTick = document.createElement("div");
      segmentTick.classList.add(classes.segmentTick);

      const segmentLabel = document.createElement("div");
      segmentLabel.classList.add(classes.segmentLabel);
      segmentLabel.innerHTML = secondsToFormattedTime(label);

      segment.append(segmentMarker, segmentTick, segmentLabel);
      segments.append(segment);
    });

    const lastSegment = document.createElement("div");
    lastSegment.classList.add(classes.segment);

    const segmentMarker = document.createElement("div");
    segmentMarker.classList.add(classes.segmentMarker);

    const segmentTick = document.createElement("div");
    segmentTick.classList.add(classes.segmentTick);

    const firstSegmentLabel = document.createElement("div");
    firstSegmentLabel.classList.add(
      classes.segmentLabel,
      classes.firstSegmentLabel
    );
    firstSegmentLabel.innerHTML = secondsToFormattedTime(labels.at(-2)!);

    const secondSegmentLabel = document.createElement("div");
    secondSegmentLabel.classList.add(
      classes.segmentLabel,
      classes.secondSegmentLabel
    );
    secondSegmentLabel.innerHTML = secondsToFormattedTime(labels.at(-1)!);

    lastSegment.append(
      segmentMarker,
      segmentTick,
      firstSegmentLabel,
      secondSegmentLabel
    );
    segments.append(lastSegment);

    return segments;
  }

  private resetSegments = () => {
    this._container.removeChild(this._segments);
    this._segments = this.buildSegments(
      this._labels.slice(this.firstLabelIndex, this.lastLabelIndex + 1)
    );
    this._segments.classList.add(classes.segments);

    this._container.append(this._segments);
  };

  private getBounds = () => ({
    wrapperLeft: this._container.offsetLeft,
    wrapperRight: this._container.offsetLeft + this._container.offsetWidth,
    wrapperWidth: this._container.offsetWidth,
    selectorLeft: this._rangeSelector.offsetLeft,
    selectorWidth: this._rangeSelector.offsetWidth,
  });

  private getSliderValues = () => {
    const { wrapperWidth, selectorLeft, selectorWidth } = this.getBounds();
    const minVisibleValue = this._labels.at(this.firstLabelIndex)!;
    const maxVisibleValue = this._labels.at(this.lastLabelIndex)!;
    const start = Math.round(
      minVisibleValue +
        (selectorLeft / wrapperWidth) * (maxVisibleValue - minVisibleValue)
    );
    const end = Math.round(
      minVisibleValue +
        ((selectorLeft + selectorWidth) / wrapperWidth) *
          (maxVisibleValue - minVisibleValue)
    );

    return { start, end };
  };

  private getSelectorBounds = (start: number, end: number) => {
    // labels should be set so that value can be displayed
    const { wrapperWidth } = this.getBounds();

    const minVisibleValue = this._labels.at(this.firstLabelIndex)!;
    const maxVisibleValue = this._labels.at(this.lastLabelIndex)!;

    const selectorLeft = Math.round(
      ((start - minVisibleValue) / (maxVisibleValue - minVisibleValue)) *
        wrapperWidth
    );

    const selectorWidth = Math.round(
      ((end - start) / (maxVisibleValue - minVisibleValue)) * wrapperWidth
    );

    return { selectorLeft, selectorWidth };
  };

  private initSlider = (start: number, end: number) => {
    const bounds = this.getSelectorBounds(start, end);

    this._rangeSelector.style.left = bounds.selectorLeft.toString() + "px";
    this._rangeSelector.style.width = bounds.selectorWidth.toString() + "px";

    this.updateDuration();
  };

  private showButtons = () => {
    const { start, end } = this.getSliderValues();

    if (start === this.currentStart && end === this.currentEnd) {
      return;
    }
    this._buttonContainer.classList.remove(classes.invisible);
  };

  private hideButtons = () => {
    this._buttonContainer.classList.add(classes.invisible);
  };

  private updateDuration = () => {
    const { start, end } = this.getSliderValues();
    const duration = end - start;
    this._rangeSelectorRangeDisplay.textContent =
      secondsToFormattedTime(duration);
  };

  private onXclick = () => {
    this.firstLabelIndex = this._initialFirstLabelIndex;
    this.resetSegments();

    const selectorBound = this.getSelectorBounds(
      this.currentStart,
      this.currentEnd
    );

    this._rangeSelector.style.left =
      selectorBound.selectorLeft.toString() + "px";
    this._rangeSelector.style.width =
      selectorBound.selectorWidth.toString() + "px";

    this.updateDuration();
    this.hideButtons();
  };

  private onCheckmarkClick = () => {
    const { start, end } = this.getSliderValues();

    this.currentStart = start;
    this.currentEnd = end;

    this._initialFirstLabelIndex = this.firstLabelIndex;

    this.updateDuration();
    this.hideButtons();

    if (this.onCheckmarkClickCallback !== undefined) {
      this.onCheckmarkClickCallback(start, end);
    }
  };

  private onMouseDownRight = (event: MouseEvent) => {
    event.preventDefault();

    const startX = event.clientX;
    const { selectorWidth, wrapperWidth, selectorLeft } = this.getBounds();

    let outOfBoundsSince: number | null = null;
    let logTimer: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      let delta = e.clientX - startX;

      let newWidth = Math.max(this.minWidth, selectorWidth + delta);
      const maxAllowedWidth = Math.min(
        wrapperWidth * this.maxWidthPercent,
        wrapperWidth - selectorLeft
      );

      const outOfBounds = newWidth > maxAllowedWidth;
      const now = performance.now();

      if (outOfBounds) {
        if (outOfBoundsSince === null) {
          outOfBoundsSince = now;

          // Callback after 0.5 seconds of being out of bounds
          logTimer = window.setTimeout(() => {
            this.outOfBoundsCallback(true);
            // Callback every 0.4 seconds after the first clalback
            logTimer = window.setInterval(
              () => this.outOfBoundsCallback(true),
              400
            );
          }, 500); // Wait for 0.5 seconds
        }
      } else {
        // Reset the log timer if the selector is back in bounds
        if (logTimer !== null) {
          clearTimeout(logTimer);
          clearInterval(logTimer);
          logTimer = null;
        }
        outOfBoundsSince = null;
      }

      newWidth = Math.min(newWidth, maxAllowedWidth);

      this._rangeSelector.style.width = `${newWidth}px`;
      this.updateDuration();
    };

    const onMouseUp = () => {
      this.showButtons();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      if (logTimer !== null) {
        clearTimeout(logTimer);
        clearInterval(logTimer);
        logTimer = null;
      }
      outOfBoundsSince = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  private onMouseDownLeft = (event: MouseEvent) => {
    event.preventDefault();

    const startX = event.clientX;
    const { selectorLeft, selectorWidth, wrapperWidth } = this.getBounds();

    let outOfBoundsSince: number | null = null;
    let logTimer: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      let delta = e.clientX - startX;
      let newLeft = selectorLeft + delta;

      const outOfBounds = newLeft < 0;
      const now = performance.now();

      if (outOfBounds) {
        if (outOfBoundsSince === null) {
          outOfBoundsSince = now;

          // Callback after 0.5 seconds of being out of bounds
          logTimer = window.setTimeout(() => {
            this.outOfBoundsCallback(false);
            // Callback every 0.4 seconds after the first clalback
            logTimer = window.setInterval(
              () => this.outOfBoundsCallback(false),
              400
            );
          }, 500); // Wait for 0.5 seconds
        }
      } else {
        // Reset the log timer if the selector is back in bounds
        if (logTimer !== null) {
          clearTimeout(logTimer);
          clearInterval(logTimer);
          logTimer = null;
        }
        outOfBoundsSince = null;
      }

      if (newLeft < 0) {
        delta = -selectorLeft;
        newLeft = 0;
      }

      let newWidth = Math.min(
        Math.max(this.minWidth, selectorWidth - delta),
        wrapperWidth
      );

      let newRight = newLeft + newWidth;
      if (newRight > wrapperWidth) newLeft = wrapperWidth - newWidth;

      if (
        newWidth > this.minWidth &&
        newWidth < wrapperWidth * this.maxWidthPercent
      ) {
        this._rangeSelector.style.left = `${newLeft}px`;
        this._rangeSelector.style.width = `${newWidth}px`;
      }
      this.updateDuration();
    };

    const onMouseUp = () => {
      this.showButtons();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      if (logTimer !== null) {
        clearTimeout(logTimer);
        clearInterval(logTimer);
        logTimer = null;
      }
      outOfBoundsSince = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  private outOfBoundsCallback = (increment: boolean) => {
    if (increment) {
      this.firstLabelIndex += 1;
    } else {
      this.firstLabelIndex -= 1;
    }

    this.resetSegments();
  };

  private onMouseDownDrag = (event: MouseEvent) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains(classes.rangeSelectorHandle)
    )
      return;

    event.preventDefault();

    const startX = event.clientX;
    const { selectorLeft, selectorWidth, wrapperWidth } = this.getBounds();

    let outOfBoundsSince: number | null = null;
    let logTimer: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      let delta = e.clientX - startX;
      let newLeft = selectorLeft + delta;
      const maxLeft = wrapperWidth - selectorWidth;

      const outOfBounds = newLeft < 0 || newLeft > maxLeft;

      const now = performance.now();

      if (outOfBounds) {
        if (outOfBoundsSince === null) {
          const increment = newLeft > maxLeft;
          outOfBoundsSince = now;

          // Callback after 0.5 seconds of being out of bounds
          logTimer = window.setTimeout(() => {
            this.outOfBoundsCallback(increment);
            // Callback every 0.4 seconds after the first clalback
            logTimer = window.setInterval(
              () => this.outOfBoundsCallback(increment),
              400
            );
          }, 500); // Wait for 0.5 seconds
        }
      } else {
        // Reset the log timer if the selector is back in bounds
        if (logTimer !== null) {
          clearTimeout(logTimer);
          clearInterval(logTimer);
          logTimer = null;
        }
        outOfBoundsSince = null;
      }

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));

      this._rangeSelector.style.left = `${newLeft}px`;
      this.updateDuration();
    };

    const onMouseUp = () => {
      this.showButtons();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Clear the timer when mouse is released
      if (logTimer !== null) {
        clearTimeout(logTimer);
        clearInterval(logTimer);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
}

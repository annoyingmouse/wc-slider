class WCSlider extends HTMLElement{
  static get observedAttributes() {
    return ['width']
  }

  get css() {
    return `
      :host {
        --width: ${this.width}px;
        --height ${this.width / 7}px;
      }
      .rangeHolder {
        position: relative;
        width: var(--width);
        height: var(--height);
        font-family: Arial, Helvetica, sans-serif;
      }
      .rangeHolder .legendHolder {
        position: absolute;
        width: var(--width);
        height: calc(var(--height) - 20px);
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
      .rangeHolder .legendHolder .legend {
        width: 140px;
        height: 100px;
      }
      .rangeHolder .legendHolder .legend header {
        cursor: pointer;
        font-size: 1.5em;
        font-weight: bold;
        color: white;
        margin: 5px 0 0 10px;
      }
      .rangeHolder .legendHolder .legend-1 {
        background: #afd6f3;
      }
      .rangeHolder .legendHolder .legend-1.deselected {
        background: #d0d5d5;
      }
      .rangeHolder .legendHolder .legend-1.deselected header {
        opacity: 0.3;
      }
      .rangeHolder .legendHolder .legend-2 {
        background: #99caef;
      }
      .rangeHolder .legendHolder .legend-2.deselected {
        background: #c2c9c9;
      }
      .rangeHolder .legendHolder .legend-2.deselected header {
        opacity: 0.3;
      }
      .rangeHolder .legendHolder .legend-3 {
        background: #83bfec;
      }
      .rangeHolder .legendHolder .legend-3.deselected {
        background: #b5bcbd;
      }
      .rangeHolder .legendHolder .legend-3.deselected header {
        opacity: 0.3;
      }
      .rangeHolder .legendHolder .legend-4 {
        background: #6db3e8;
      }
      .rangeHolder .legendHolder .legend-4.deselected {
        background: #a7b0b1;
      }
      .rangeHolder .legendHolder .legend-4.deselected header {
        opacity: 0.3;
      }
      .rangeHolder .legendHolder .legend-5 {
        background: #57a8e5;
      }
      .rangeHolder .legendHolder .legend-5.deselected {
        background: #9aa4a5;
      }
      .rangeHolder .legendHolder .legend-5.deselected header {
        opacity: 0.3;
      }
      .rangeHolder .legendHolder .legend-6 {
        background: #419ce1;
      }
      .rangeHolder .legendHolder .legend-6.deselected {
        background: #8c9899;
      }
      .rangeHolder .legendHolder .legend-6.deselected header {
        opacity: 0.3;
      }
      .rangeHolder .legendHolder .legend-7 {
        background: #2b91de;
      }
      .rangeHolder .legendHolder .legend-7.deselected {
        background: #7f8c8d;
      }
      .rangeHolder .legendHolder .legend-7.deselected header {
        opacity: 0.3;
      }
      .rangeHolder[data-value="1"] .sliderHolder {
        left: 140px;
      }
      .rangeHolder[data-value="1"] .sliderHolder .pseudoSlider {
        background: linear-gradient(to right, #afd6f3, #afd6f3 70%, white 70%, white);
      }
      .rangeHolder[data-value="2"] .sliderHolder {
        left: 280px;
      }
      .rangeHolder[data-value="2"] .sliderHolder .pseudoSlider {
        background: linear-gradient(to right, #99caef, #99caef 70%, white 70%, white);
      }
      .rangeHolder[data-value="3"] .sliderHolder {
        left: 420px;
      }
      .rangeHolder[data-value="3"] .sliderHolder .pseudoSlider {
        background: linear-gradient(to right, #83bfec, #83bfec 70%, white 70%, white);
      }
      .rangeHolder[data-value="4"] .sliderHolder {
        left: 560px;
      }
      .rangeHolder[data-value="4"] .sliderHolder .pseudoSlider {
        background: linear-gradient(to right, #6db3e8, #6db3e8 70%, white 70%, white);
      }
      .rangeHolder[data-value="5"] .sliderHolder {
        left: 700px;
      }
      .rangeHolder[data-value="5"] .sliderHolder .pseudoSlider {
        background: linear-gradient(to right, #57a8e5, #57a8e5 70%, white 70%, white);
      }
      .rangeHolder[data-value="6"] .sliderHolder {
        left: 840px;
      }
      .rangeHolder[data-value="6"] .sliderHolder .pseudoSlider {
        background: linear-gradient(to right, #419ce1, #419ce1 70%, white 70%, white);
      }
      .rangeHolder[data-value="7"] .sliderHolder {
        left: 980px;
      }
      .rangeHolder[data-value="7"] .sliderHolder .pseudoSlider {
        background: linear-gradient(to right, #2b91de, #2b91de 70%, white 70%, white);
      }
      .rangeHolder .sliderHolder {
        position: absolute;
        top: -10px;
      }
      .rangeHolder .sliderHolder .arrowPointerBack {
        position: absolute;
        height: 20px;
        width: 20px;
        left: -10px;
        top: 50px;
        background: white;
        transform: rotate(45deg);
        transform-origin: center center;
      }
      .rangeHolder .sliderHolder .pseudoSlider {
        position: absolute;
        height: 120px;
        width: 10px;
        left: -5px;
      }
      .rangeHolder .sliderHolder .arrowPointerFront {
        cursor: pointer;
        position: absolute;
        height: 40px;
        width: 40px;
        left: -20px;
        top: 40px;
        transform: rotate(45deg);
        transform-origin: center center;
      }
    `
  }

  get html() {
    return `
      <div class="rangeHolder"
           data-value="${this.value}">
        <div class="legendHolder">
          ${this.range.map(e => (
            `<div class="legend legend-${e} ">
              <header>${e}</header>
            </div>`  
          )).join('')}
        </div>
        <div class="sliderHolder">
          <div class="arrowPointerBack"></div>
          <div class="arrowPointerFront"></div>
          <div class="pseudoSlider"></div>
        </div>
      </div>
    `
  }
  constructor() {
    super()
    this.shadow = this.attachShadow({
      mode: 'open',
    })
    console.log(this.colourRange)
  }
  render() {
    this.shadow.innerHTML = `<style>${this.css}</style>${this.html}`
  }
  connectedCallback() {
    console.log('connected')
    this.render()
  }
  get width() {
    return Number(this.getAttribute('width')) || 980
  }
  get value() {
    return Number(this.getAttribute('value'))
  }
  get min() {
    return Number(this.getAttribute('min'))
  }
  get max() {
    return Number(this.getAttribute('max'))
  }
  get from() {
    return this.getAttribute('from') || '#afd6f3'
  }
  get to() {
    return this.getAttribute('to') || '#2b91de'
  }
  get colourRange() {
    this.range.map((element, index, array) => {

    })
  }
  get range() {
    return Array.from({length: (this.max + 1) - this.min}, (_, i ) => i + this.min)
  }
}

window.customElements.define('wc-slider', WCSlider)
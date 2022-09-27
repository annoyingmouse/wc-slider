class WCSlider extends HTMLElement {
  static get observedAttributes() {
    return [
      'width',
      'value',
      'min',
      'max',
      'from',
      'to',
      'deselected-from',
      'deselected-to',
    ]
  }
  get css() {
    return `
      :host {
        --width: ${(this.parentWidth / 100) * this.width}px;
        --segment-width: ${
          ((this.parentWidth / 100) * this.width) / this.range.length
        }px; 
        --height: ${
          ((this.parentWidth / 100) * this.width) / this.range.length
        }px;
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
        height: var(--height);
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
      .rangeHolder .legendHolder .legend {
        width: var(--segment-width);
        height: var(--height);
      }
      .rangeHolder .legendHolder .legend header {
        cursor: pointer;
        font-size: calc((var(--segment-width) / 5));
        font-weight: bold;
        margin: calc(var(--segment-width) * 0.05) 0 0 calc(var(--segment-width) * 0.1);
        user-select: none;
      }
      
      ${this.colourRange
        .map(
          (e, i) => `
          .rangeHolder .legendHolder .legend-${this.range[i]} {
            background: ${e};
          }
          .rangeHolder .legendHolder .legend-${this.range[i]} header {
            color: ${this.invertColor(e, true)};
          }
        `
        )
        .join('')}
      
      ${this.deselectedRange
        .map(
          (e, i) => `
          .rangeHolder .legendHolder .legend-${this.range[i]}.deselected {
            background: ${e};
            color: ${this.invertColor(e, true)};
          }
          .rangeHolder .legendHolder .legend-${
            this.range[i]
          }.deselected header {
            opacity: 0.5;
          }
        `
        )
        .join('')}
      
      ${this.range
        .map(
          (e, i, array) => `
            .rangeHolder[data-value="${e}"] .sliderHolder {
              left: calc((var(--width) / ${array.length}) * ${i + 1});
            }
            .rangeHolder[data-value="${e}"] .sliderHolder .pseudoSlider {
              background: linear-gradient(to right, ${this.colourRange[i]}, ${
            this.colourRange[i]
          } 70%, white 70%, white);
            }`
        )
        .join('')}

      .rangeHolder .sliderHolder {
        position: absolute;
        top: -10px;
      }
      .rangeHolder .sliderHolder .arrowPointerBack {
        position: absolute;
        height: calc(var(--segment-width) * 0.2);
        width: calc(var(--segment-width) * 0.2);
        left: calc(var(--segment-width) * -0.1);
        bottom: 0;
        transform: rotate(45deg) translate(calc((var(--height) - 10px) / 2), calc((var(--height) - 10px) / 2));
        background: white;
        transform-origin: center center;
      }
      .rangeHolder .sliderHolder .pseudoSlider {
        position: absolute;
        height: calc(var(--height) + 20px);
        width: calc(var(--segment-width) * 0.1);
        left: calc(var(--segment-width) * -0.05);
      }
      .rangeHolder .sliderHolder .arrowPointerFront {
        cursor: pointer;
        position: absolute;
        height: calc(var(--segment-width) * 0.4);
        width: calc(var(--segment-width) * 0.4);
        left: calc(var(--segment-width) * -0.2);
        bottom: 0;
        transform: rotate(45deg) translate(calc((var(--height) + 10px) / 2), calc((var(--height) + 10px) / 2));
      }
    `
  }
  get html() {
    return `
      <div class="rangeHolder"
           data-value="${this.value}">
        <div class="legendHolder">
          ${this.range
            .map(
              (e) => `
                <div class="legend legend-${e} ">
                  <header>${e}</header>
                </div>
              `
            )
            .join('')}
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
      mode: 'closed',
    })
  }
  render() {
    this.shadow.innerHTML = `<style>${this.css}</style>${this.html}`
    this.shadow.querySelectorAll('header').forEach((header) => {
      header.addEventListener('click', (e) => {
        const target = Number(
          [...e.target.parentNode.classList]
            .find((c) => /legend-\d/.test(c))
            .replace(/^\D+/g, '')
        )
        this.value = target
      })
    })
    this.shadow.querySelectorAll('.legend').forEach((legend) => {
      if (
        Number(
          [...legend.classList]
            .find((c) => /legend-\d/.test(c))
            .replace(/^\D+/g, '')
        ) <= this.value
      ) {
        legend.classList.remove('deselected')
      } else {
        legend.classList.add('deselected')
      }
    })
    this.shadow
      .querySelector('.arrowPointerFront')
      .addEventListener('click', (e) => {
        if (e.offsetX < e.target.offsetWidth / 2) {
          if (this.value !== this.min) {
            this.value -= 1
          }
        } else {
          if (this.value !== this.max) {
            this.value += 1
          }
        }
      })
  }
  connectedCallback() {
    this.parentWidth = this.parentNode.offsetWidth
    this.render()
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }
  rgb(color) {
    const hex = color.replace('#', '')
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    }
  }
  gradient(color1, color2, ratio) {
    const from = this.rgb(color1)
    const to = this.rgb(color2)
    const r = Math.ceil(from.r * ratio + to.r * (1 - ratio))
    const g = Math.ceil(from.g * ratio + to.g * (1 - ratio))
    const b = Math.ceil(from.b * ratio + to.b * (1 - ratio))
    return '#' + this.hex(r) + this.hex(g) + this.hex(b)
  }
  invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1)
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.')
    }
    let r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16)
    if (bw) {
      // https://stackoverflow.com/a/3943023/112731
      return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
    }
    // invert color components
    r = (255 - r).toString(16)
    g = (255 - g).toString(16)
    b = (255 - b).toString(16)
    // pad each with zeros and return
    return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b)
  }
  padZero(str, len) {
    len = len || 2
    const zeros = new Array(len).join('0')
    return (zeros + str).slice(-len)
  }
  hex(num) {
    num = num.toString(16)
    return num.toString().length === 1 ? '0' + num : num
  }
  get colourRange() {
    return this.range
      .map((element, index, array) => {
        if (index === 0) {
          return this.to
        }
        if (index === array.length - 1) {
          return this.from
        }
        return this.gradient(this.from, this.to, (index + 1) / array.length)
      })
      .reverse()
  }
  get deselectedRange() {
    return this.range
      .map((element, index, array) => {
        if (index === 0) {
          return this.deselectedTo
        }
        if (index === array.length - 1) {
          return this.deselectedFrom
        }
        return this.gradient(
          this.deselectedFrom,
          this.deselectedTo,
          (index + 1) / array.length
        )
      })
      .reverse()
  }
  get range() {
    return Array.from(
      { length: this.max + 1 - this.min },
      (_, i) => i + this.min
    )
  }
  get width() {
    return Number(this.getAttribute('width')) || 100
  }
  get value() {
    return Number(this.getAttribute('value')) || 4
  }
  set value(value) {
    if (value !== this.value) {
      this.setAttribute('value', value)
    }
  }
  get min() {
    return this.getAttribute('min') ? Number(this.getAttribute('min')) : 1
  }
  get max() {
    return this.getAttribute('max') ? Number(this.getAttribute('max')) : 7
  }
  get from() {
    return this.getAttribute('from') || '#afd6f3'
  }
  get to() {
    return this.getAttribute('to') || '#2b91de'
  }
  get deselectedFrom() {
    return this.getAttribute('deselected-from') || '#d0d5d5'
  }
  get deselectedTo() {
    return this.getAttribute('deselected-to') || '#7f8c8d'
  }
}
window.customElements.define('wc-slider', WCSlider)
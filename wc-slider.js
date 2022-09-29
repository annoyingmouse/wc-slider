class WCSlider extends HTMLElement {
  #range
  #colourRange
  #deselectedRange

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
          ((this.parentWidth / 100) * this.width) / this.#range.length
        }px; 
        --height: ${
          ((this.parentWidth / 100) * this.width) / this.#range.length
        }px;
      }
      .rangeHolder {
        position: relative;
        width: var(--width);
        overflow: hidden;
        height: var(--height);
        font-family: Arial, Helvetica, sans-serif;
        padding: 10px;
      }
      .legendHolder {
        position: absolute;
        width: var(--width);
        height: calc(var(--height));
        top: 10px;
        left: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
      .legend {
        width: var(--segment-width);
        height: var(--height);
      }
      header {
        font-size: calc((var(--segment-width) / 5));
        font-weight: bold;
        margin: calc(var(--segment-width) * 0.05) 0 0 calc(var(--segment-width) * 0.1);
        user-select: none;
      }
      
      ${this.#colourRange
        .map(
          (e, i) => `
          .legend-${this.#range[i]} {
            background: ${e};
          }
          .legend-${this.#range[i]} header {
            color: ${this.invertColor(e, true)};
          }
          
          .legend-${this.#range[i]} header {
            cursor: ${
              this.#range[i] < this.constrainMin ||
              this.#range[i] > this.constrainMax
                ? 'not-allowed'
                : 'pointer'
            };
          }          
        `
        )
        .join('')}
      
      ${this.#deselectedRange
        .map(
          (e, i) => `
          .legend-${this.#range[i]}.deselected {
            background: ${e};
            color: ${this.invertColor(e, true)};
          }
          .legend-${this.#range[i]}.deselected header {
            opacity: 0.5;
          }
        `
        )
        .join('')}
      
      ${this.#range
        .map(
          (e, i, array) => `
            .rangeHolder[data-value="${e}"] .sliderHolder {
              left: calc(((var(--segment-width) * ${
                i + 1
              }) + 10px) + var(--segment-width) * -0.05);
            }
            .rangeHolder[data-value="${e}"] .sliderHolder .pseudoSlider {
              background: linear-gradient(to right, ${this.#colourRange[i]}, ${
            this.#colourRange[i]
          } 70%, white 70%, white);
            }`
        )
        .join('')}

      .sliderHolder {
        position: absolute;
        top: 0;
        cursor: grab;
        height: calc(var(--height) + 20px);
        width: calc(var(--segment-width) * 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .arrowPointerBack {
        height: calc(var(--segment-width) * 0.2);
        width: calc(var(--segment-width) * 0.2);
        transform: rotate(45deg);
        background: white;
        transform-origin: center center;
      }
      .pseudoSlider {
        position: absolute;
        height: calc(var(--height) + 20px);
        width: calc(var(--segment-width) * 0.1);
        left: calc(var(--segment-width) * -0.05);
        left: 0;
      }
      .arrowPointerFront {
        cursor: pointer;
        position: absolute;
        height: var(--height);
        width: calc(var(--segment-width) * 0.6);
        left: calc((var(--segment-width) * -0.3) + (var(--segment-width) * 0.1) / 2);
        top: 10px;
      }
    `
  }

  get html() {
    return `
      <div class="rangeHolder"
           data-value="${this.value}">
        <div class="legendHolder">
          ${this.#range
            .map(
              (e) => `
                <div class="legend legend-${e} ">
                  <header>${e}</header>
                </div>
              `
            )
            .join('')}
        </div>
        <div class="sliderHolder" draggable="true">
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
    this.#range = this.range
    this.#colourRange = this.colourRange
    this.#deselectedRange = this.deselectedRange
    this.shadow.innerHTML = `<style>${this.css}</style>${this.html}`
    this.legendHolder = this.shadow.querySelector('.legendHolder')
    this.legends = this.legendHolder.querySelectorAll('.legend')
    this.sliderHolder = this.shadow.querySelector('.sliderHolder')
    this.rangeHolder = this.shadow.querySelector('.rangeHolder')
    this.handleClicks()
    this.handleLegendsClass()
    this.handleArrowClick()
    this.handleSlider()
  }

  handleSlider() {
    this.sliderHolder.addEventListener('dragstart', (e) => {
      const img = document.createElement('img')
      img.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAA1BMVEVHcEyC+tLSAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII='
      this.shadow.appendChild(img)
      e.dataTransfer.setDragImage(img, 0, 0)
      e.dataTransfer.dropEffect = 'none'
      e.dataTransfer.effectAllowed = 'all'
      this.shiftX = e.clientX - this.sliderHolder.getBoundingClientRect().left
    })
    this.sliderHolder.addEventListener(
      'drag',
      (e) => {
        const rect = this.getBoundingClientRect()
        let newLeft = e.pageX - rect.left
        if (newLeft < 10) {
          newLeft = 10
        }
        let rightEdge =
          this.legendHolder.offsetWidth - this.sliderHolder.offsetWidth + 10
        if (newLeft > rightEdge) {
          newLeft = rightEdge
        }
        this.sliderHolder.style.left = newLeft + 'px'
      },
      false
    )
    this.sliderHolder.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
    this.sliderHolder.addEventListener('dragend', (e) => {
      e.preventDefault()
      const rect = this.getBoundingClientRect()
      const offsetX = e.pageX - rect.left
      if (offsetX < 10) {
        this.value = this.#range[0]
        return
      }
      if (offsetX > rect.width) {
        this.value = this.#range[this.#range.length - 1]
        return
      } else {
        this.legends.forEach((legend) => {
          const legendRect = legend.getBoundingClientRect()

          if (
            offsetX >= legendRect.x - rect.left &&
            offsetX <= legendRect.x - rect.left + legendRect.width
          ) {
            const draggedValue = Number(
              [...legend.classList]
                .find((c) => /legend-\d/.test(c))
                .replace(/^\D+/g, '')
            )
            this.value = draggedValue
          }
        })
      }
    })
  }

  handleClicks() {
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
  }

  handleLegendsClass() {
    this.legends.forEach((legend) => {
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
  }

  handleArrowClick() {
    this.sliderHolder
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
    this.parentWidth = this.parentNode.getBoundingClientRect().width - 40
    this.render()
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value') {
      this.render()
    } else {
      if (oldValue !== newValue) {
        this.render()
      }
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
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  sanitiseHex(hex) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1)
    }
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    if (hex.length !== 6) {
      throw new Error('Invalid colour.')
    }
    return `#${hex}`
  }

  invertColor(hex, bw) {
    let { r, g, b } = this.rgb(hex)
    return bw
      ? r * 0.299 + g * 0.587 + b * 0.114 > 186
        ? '#000000'
        : '#FFFFFF'
      : `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g)
          .toString(16)
          .padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`
  }

  get colourRange() {
    return this.#range
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
    return this.#range
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
    let value = this.getAttribute('value')
      ? Number(this.getAttribute('value'))
      : 4
    if (value < this.constrainMin) {
      value = this.constrainMin
    }
    if (value > this.constrainMax) {
      value = this.constrainMax
    }
    return value
  }

  set value(value) {
    if (value < this.constrainMin) {
      this.setAttribute('value', this.constrainMin.toString())
    } else {
      if (value > this.constrainMax) {
        this.setAttribute('value', this.constrainMax.toString())
      } else {
        this.setAttribute('value', value.toString())
      }
    }
  }

  get min() {
    return this.getAttribute('min') ? Number(this.getAttribute('min')) : 1
  }

  get max() {
    return this.getAttribute('max') ? Number(this.getAttribute('max')) : 7
  }

  get from() {
    return this.getAttribute('from')
      ? this.sanitiseHex(this.getAttribute('from'))
      : '#afd6f3'
  }

  get to() {
    return this.getAttribute('to')
      ? this.sanitiseHex(this.getAttribute('to'))
      : '#2b91de'
  }

  get deselectedFrom() {
    return this.getAttribute('deselected-from')
      ? this.sanitiseHex(this.getAttribute('deselected-from'))
      : '#d0d5d5'
  }

  get deselectedTo() {
    return this.getAttribute('deselected-to')
      ? this.sanitiseHex(this.getAttribute('deselected-to'))
      : '#7f8c8d'
  }

  get constrainMin() {
    return this.getAttribute('constrain-min')
      ? Number(this.getAttribute('constrain-min'))
      : this.min
  }

  get constrainMax() {
    return this.getAttribute('constrain-max')
      ? Number(this.getAttribute('constrain-max'))
      : this.max
  }
}
window.customElements.define('wc-slider', WCSlider)

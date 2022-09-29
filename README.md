# <wc-slider>

This web component creates a highly configurable slider element.

## Usage

```html
<wc-slider></wc-slider>
<script type="module" src="wc-slider.js"></script>
```

## Configuration

The slider's appearance and behaviour can be changed using attributes.

Adding a `width` number variable will change the dimension of the chart from the default of 100%.

Adding a `min` number variable will change the start number of the slider from the default of 1.

Adding a `max` number variable will change the end number of the slider from the default of 7.

Adding a `from` hex colour will change the start colour of the slider from the default of `#afd6f3`.

Adding a `to` hex colour will change the end colour of the slider from the default of `#2b91de`.

(there will be a stepped gradient of shades between `from` and `to` between `min` and `max`)

Adding a `deselected-from` hex colour will change the deselected start colour of the slider from the default of `#d0d5d5` (In reality, this will never be shown).

Adding a `deselected-to` hex colour will change the deselected end colour of the slider from the default of `#7f8c8d`.

(there will be a stepped gradient of deselected shades between `deselected-from` and `deselected-to` between `min` and `max`)

Adding a `constrain-min` number variable will constrain the minimum value surfaced by the slider. The default value is the `min`

Adding a `constrain-max` number variable will constrain the maximum value surfaced by the slider. The default value is the `max`

All attributes are optional

## Usage

Dragging the slider element will alter the value surfaced by the component from its `value` attribute (should the number in which the drop ends be greater than or equal to the `constrain-min` or less than or equal to the `constrain-max`)

Clicking on the numbers shown at the top of each step will alter the value surfaced by the component from its `value` attribute (should the number be greater than or equal to the `constrain-min` or less than or equal to the `constrain-max`).

Clicking on the triangles either side of the slider will alter the value surfaced by the component from its `value` attribute by +/- 1 (should the number resulting from the click be greater than or equal to the `constrain-min` or less than or equal to the `constrain-max`).

## Caution

The range of numbers, inclusive of `min` and `max`, should not be too large - tests have found that the ranges should not have more than 15 numbers, but YMMV.

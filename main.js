;(() => {
  const getRandomInt = (min, max) =>
    Math.floor(
      Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)
    )
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  setInterval(() => {
    const attributes = [
      'width',
      'min',
      'max',
      'from',
      'to',
      'deselected-from',
      'deselected-to',
    ]

    const widthTest = document.getElementById('widthTest')
    const width = getRandomInt(50, 100)
    widthTest.setAttribute('width', width)
    document.getElementById('width').innerText = width

    const minMaxTest = document.getElementById('minMaxTest')
    const min = getRandomInt(1, 200)
    const max = getRandomInt(min + 3, min + 20)
    const value = getRandomInt(min, max)
    minMaxTest.setAttribute('min', min)
    minMaxTest.setAttribute('max', max)
    minMaxTest.setAttribute('value', value)
    document.getElementById('min').innerText = min
    document.getElementById('max').innerText = max

    const fromToTest = document.getElementById('fromToTest')
    const from = getRandomColor()
    const to = getRandomColor()
    fromToTest.setAttribute('from', from)
    fromToTest.setAttribute('to', to)
    fromToTest.setAttribute('value', '7')
    document.getElementById('from').innerText = from
    document.getElementById('to').innerText = to

    const deselectedFromToTest = document.getElementById('deselectedFromToTest')
    const deselectedFrom = getRandomColor()
    const deselectedTo = getRandomColor()
    deselectedFromToTest.setAttribute('deselected-from', deselectedFrom)
    deselectedFromToTest.setAttribute('deselected-to', deselectedTo)
    deselectedFromToTest.setAttribute('value', '1')
    document.getElementById('deselected-from').innerText = deselectedFrom
    document.getElementById('deselected-to').innerText = deselectedTo
  }, 10000)
})()

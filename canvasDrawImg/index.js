const canvas = document.createElement('canvas')

const ctx = canvas.getContext('2d')

const img = new Image()

let cube, cube_c, randomCube, width, height
img.src = './1.webp'
// img.src = './2.jpeg'
img.onload = function () {
  width = this.width / 2
  height = this.height / 2
  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)
  cube = ctx.getImageData(0, 0, width, height)
  console.log(cube.data[0]);
  cube_c = ctx.getImageData(0, 0, width, height)
  randomCube = Array.prototype.map.call(cube.data, item => Math.floor(Math.random() * item * 100000))
  animation()
}

function animation() {
  randomCube.forEach((c, i) => {
    if(c - cube.data[i] < 1400000) randomCube[i] = cube.data[i]
    else if(c < cube.data[i]) randomCube[i] += Math.floor(Math.random() * 100000)
    else if(c > cube.data[i]) randomCube[i] -= Math.floor(Math.random() * 100000)
    
    cube_c.data[i] = randomCube[i]
  })
  ctx.putImageData(cube_c, 0, 0)
  requestAnimationFrame(animation)
}

document.body.appendChild(canvas)
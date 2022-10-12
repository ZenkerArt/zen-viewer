import {ExternalFile} from '../Files/Files'
import {Socket} from 'node:net'
import * as Buffer from 'buffer'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

export function sharpImage(path: string, rescale: number = 1024): Promise<HTMLImageElement> {
  const client = new Socket()

  client.connect(8080, '127.0.0.1', function () {
    client.write(JSON.stringify({
      path: path,
      rescale: rescale
    }))
  })

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    client.on('close', function () {
      const blob = new Blob(chunks, {
        type: 'image/jpeg'
      })
      resolve(loadImageUrl(URL.createObjectURL(blob)))
    })

    client.on('data', function (data) {
      chunks.push(data)
    })
  })
}


function loadImageUrl(url: string, image?: HTMLImageElement): Promise<HTMLImageElement> {
  image = image || document.createElement('img')

  if (image === undefined) {
    throw new Error('Image is undefined')
  }

  image.src = url

  return new Promise((resolve, reject) => {
    if (image === undefined) {
      return reject()
    }

    image.onload = () => {
      resolve(image as HTMLImageElement)
    }

    image.onerror = () => {
      reject('Image loading error')
    }
  })
}

function loadImageFile(file: ExternalFile, image?: HTMLImageElement): Promise<HTMLImageElement> {
  return file.loadUrl()
    .then(url => loadImageUrl(url, image))
}


function resizeImage(image: HTMLImageElement, width: number): Promise<HTMLImageElement> {
  if (width > image.naturalWidth) {
    return Promise.resolve(image)
  }

  const aspect = image.naturalHeight / image.naturalWidth
  Object.assign(canvas, {
    width,
    height: width * aspect
  })
  ctx.drawImage(image, 0, 0, width, width * aspect)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) return reject('Image resize error')
      URL.revokeObjectURL(image.src)
      loadImageUrl(URL.createObjectURL(blob))
        .then(resolve)
    })
  })

}

function loadImageResize(file: ExternalFile, width: number): Promise<HTMLImageElement> {
  return loadImageFile(file)
    .then(image => resizeImage(image, width))
}

export {loadImageResize, loadImageFile, resizeImage}
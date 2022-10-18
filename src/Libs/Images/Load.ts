import {ExternalFile} from '@Libs/Files'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

export async function sharpImage(path: string, rescale: number = 1024): Promise<HTMLImageElement> {
  // @ts-ignore
  const image = await window.electronAPI.loadImage(path, rescale)
  const blob = new Blob(image, {
    type: 'image/jpeg'
  })

  return await loadImageUrl(URL.createObjectURL(blob))
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
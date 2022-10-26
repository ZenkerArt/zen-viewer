import {ZenImage} from '@Libs/Canvas/Components'
import {ZenSignal} from '@Libs/Canvas/Component/ZenSignal'

class LoadingLoop {
  private readonly _images: ZenImage[] = []
  private _owner: ZenImageLoader
  private _isStop: boolean = true
  private _promise?: Promise<void>
  onStop = (images: ZenImage[]) => {}

  constructor(images: ZenImage[], owner: ZenImageLoader) {
    this._images = images
    this._owner = owner
  }

  private async loop() {
    for (const image of this._images) {
      await this._owner.loadImage(image)
      if(this._isStop) {
        break
      }
    }
    this._isStop = true
    this.onStop(this._images)
  }


  start() {
    this._isStop = false
    this._promise = this.loop()
  }

  async stop() {
    this._isStop = true
    await Promise.all([this._promise])
  }
}

export class ZenImageLoader {
  private _loadingLoop?: LoadingLoop
  private _loadedImageCount = 0
  private _imageCount = 0
  onImageLoaded: ZenSignal<ZenImageLoader, ZenImage> = new ZenSignal()
  onStartLoad: ZenSignal<ZenImageLoader, ZenImage[]> = new ZenSignal()
  onEndLoad: ZenSignal<ZenImageLoader, ZenImage[]> = new ZenSignal()

  get loadedImageCount() {
    return this._loadedImageCount
  }
  get imageCount() {
    return this._imageCount
  }

  loadImage = async (image: ZenImage) => {
    try {
      await image.load()
    } catch {
      return
    }
    this._loadedImageCount += 1
    this.onImageLoaded.emit(this, image)
  }

  async loadImages(images: ZenImage[]) {
    if (this._loadingLoop) {
      try {
        await this._loadingLoop.stop()
      }
      catch {
        return
      }
    }
    this._loadingLoop = new LoadingLoop(images, this)
    this._loadingLoop.onStop = (images) => this.onEndLoad.emit(this, images)

    this._loadingLoop.start()

    this._loadedImageCount = 0
    this._imageCount = images.length
    this.onStartLoad.emit(this, images)

  }
}
import {ExternalFile} from '@Libs/Files/Files'
import {Vector2, VMath} from '@Libs/Math'
import {sharpImage} from '../../Images/Load'
import {ZenComponent} from '@Libs/Canvas/Component'

class ImageInfo {
  size: Vector2 = Vector2.create()
  aspect: number = 1
  element: HTMLImageElement

  constructor(image: HTMLImageElement) {
    this.element = image
    this.size.set(image.naturalWidth, image.naturalHeight)
    this.aspect = image.naturalHeight / image.naturalWidth
  }

  getNewSize(width: number): Vector2 {
    return Vector2.create(
      width,
      width * this.aspect
    )
  }

  destroy() {
    const url = this.element.src
    this.element.src = ''
    URL.revokeObjectURL(url)
  }
}

export class ZenImage extends ZenComponent {
  private _loaded: boolean = false
  private _size: Vector2 = new Vector2()
  private _pos: Vector2 = new Vector2()
  file!: ExternalFile
  image?: ImageInfo
  isEnable: boolean = false

  get isLoaded() {
    return this._loaded
  }

  get id(): string {
    return this.file.id
  }

  setFile(file: ExternalFile) {
    this.file = file
    return this
  }

  async load() {
    if (this._loaded) {
      return this
    }

    const image = await sharpImage(this.file.path)
    this.image = new ImageInfo(image)

    this.isEnable = true
    this._loaded = true
    return this
  }

  setWidth(width: number) {
    if (this.image)
      this.transform.size.set(this.image.getNewSize(width))
    return this
  }

  setSpawnPoint(pos: Vector2) {
    this._pos.set(pos)
  }

  protected onDestroy() {
    if (this.image)
      this.image.destroy()
  }

  get deltaPos() {
    return this._pos
  }

  protected render(): void {
    const ctx = this.ctx
    const {offset, position, size} = this.transform

    if (this.image) {
      this._pos = VMath.lerp(this._pos, position, .1)
      this._size = VMath.lerp(this._size, size, .1)

      const pos = VMath.add(this._pos, offset)

      ctx.drawImage(this.image.element, ...pos.tuple, ...this._size.tuple)
    }
  }
}
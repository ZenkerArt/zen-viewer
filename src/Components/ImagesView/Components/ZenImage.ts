import {ExternalFile} from '../../../Libs/Files/files'
import {Vector2, VMath} from '../../../Libs/Math/Vector2'
import {ZenComponent} from '../Component'
import {sharpImage} from '../../../Libs/Images/Load'

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
    this._loaded = true

    const image = await sharpImage(this.file.path)
    this.image = new ImageInfo(image)
    this.isEnable = true
    return this
  }

  setWidth(width: number) {
    if (this.image)
      this.transform.size.set(this.image.getNewSize(width))
    return this
  }

  protected onDestroy() {
    if (this.image)
      this.image.destroy()
  }

  protected render(): void {
    const ctx = this.ctx
    const {posOffset, size} = this.transform

    if (this.image) {
      this._pos = VMath.lerp(this._pos, posOffset, .2)
      this._size = VMath.lerp(this._size, size, .2)

      ctx.drawImage(this.image.element, ...this._pos.tuple, ...this._size.tuple)
    }
  }
}
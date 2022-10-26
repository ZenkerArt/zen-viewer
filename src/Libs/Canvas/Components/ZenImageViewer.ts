import {ZenComponentGroup, ZenEvents} from '@Libs/Canvas/Component'
import {ZenImage} from '@Libs/Canvas/Components/ZenImage'
import {Vector2, VMath} from '@Libs/Math'
import {MouseButton} from '@Libs/Canvas/Component/ZenEvents'
import {imagePopupStore} from '@StoreIndex'

class Events extends ZenEvents<ZenImageViewer> {
  offset: Vector2 = Vector2.create()
  isMove: boolean = false

  onWheel(event: WheelEvent) {
    const mouse = Vector2.createFromEvent(event)
    const scale = this.owner.scale
    this.owner.zoomToPoint(mouse, event.deltaY < 0 ? scale * 1.1 : scale / 1.1)
  }

  onMouseDown(event: MouseEvent) {
    this.isMove = false
    this.offset = VMath.sub(Vector2.createFromEvent(event), this.owner.pos)
  }

  onMouseUp(event: MouseEvent) {
    if (this.isMove || this.mouseButton === MouseButton.right) return
    imagePopupStore.hide()
  }

  onMouseMove(event: MouseEvent) {
    const mouse = Vector2.createFromEvent(event)

    if (this.isMouseDown && this.mouseButton === MouseButton.left) {
      this.owner.pos = VMath.sub(mouse, this.offset)
      this.isMove = Math.abs(this.lastMouse.length() - mouse.length()) > 5
    }
  }

  onResize = () => {
    this.owner.onResize()
  }
}

export enum Animations {
  left,
  right,
  point
}

export class ZenImageViewer extends ZenComponentGroup {
  private _image?: ZenImage
  private _scale = 1
  private _pos: Vector2 = Vector2.create()
  private _fitSize: Vector2 = Vector2.create()
  events = new Events()

  get pos() {
    return this._pos
  }

  set pos(value: Vector2) {
    this._pos = value
  }

  get scale() {
    return this._scale
  }

  set scale(value: number) {
    this._scale = value
  }

  setImage = async (url: string, translateAnimation: Animations = Animations.point) => {
    const image = new ZenImage()
    const img = this._image

    try {
      this.clear()
      await image.loadFromUrl(url)
      this.addComponent(image)
    } catch (e) {
    }

    this._image = image
    const {pos} = imagePopupStore.spawnPoint
    if (translateAnimation === Animations.point) {
      image.setSpawnPoint(pos)
      this.fitImage(image)
    }
    else if (translateAnimation === Animations.right) {
      const size = this.fitImage(image)
      image.setSpawnPoint(Vector2.create(-size.x, 0))
      image.setSpawnSize(size)
    }
    else if (translateAnimation === Animations.left) {
      image.setSpawnPoint(Vector2.create(this.canvas.width, 0))
      const size = this.fitImage(image)
      image.setSpawnSize(size)
    }

    imagePopupStore.spawnPoint = {
      size: Vector2.create(),
      pos: Vector2.create(this.canvas.width / 2, this.canvas.height / 2)
    }
  }

  onResize() {
    if (this._image === undefined) return
    this.fitImage(this._image)
  }

  fitImage(image: ZenImage) {
    if (image.imageInfo === undefined) return Vector2.create()

    const imageInfo = image.imageInfo
    const canvas = this.canvas
    const windowSize = Vector2.create(canvas.width, canvas.height)

    let x = windowSize.x
    let y = windowSize.x * imageInfo.aspectY

    if (y > windowSize.y) {
      x = windowSize.y * imageInfo.aspectX
      y = windowSize.y
    }

    const imageSize = Vector2.create(x, y)
    const newPos = Vector2.create(
      windowSize.x / 2 - imageSize.x / 2,
      windowSize.y / 2 - imageSize.y / 2
    )

    this._fitSize = imageSize
    this._pos = newPos
    this._scale = 1
    return imageSize
  }

  zoomToPoint(point: Vector2, scale: number) {
    const image = this._image
    if (image === undefined) return
    if (image.imageInfo?.size === undefined) return

    const oldScale = this._scale
    const newScale = scale

    const offset = VMath.div(VMath.sub(point, this._pos), oldScale)

    this._pos.set(
      point.x - offset.x * newScale,
      point.y - offset.y * newScale)

    this._scale = newScale
  }

  protected render(): void {
    const image = this._image
    if (image === undefined) return
    if (image.imageInfo?.size === undefined) return

    image.transform.size.set(VMath.mul(this._fitSize, this._scale))
    image.transform.position.set(this._pos)
    this.canvas.ctx.imageSmoothingEnabled = this._scale < 20
  }

}
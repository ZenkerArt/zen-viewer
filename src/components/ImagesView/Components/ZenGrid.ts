import {ZenImage} from './ZenImage'
import {max} from 'mathjs'
import {ExternalFile} from '../../../libs/Files/files'
import {imagePopupStore} from '../../../store/ImageViewerStore/ImagePopupStore'
import {Vector2} from '../../../libs/Math/Vector2'
import {lerp} from '../../../libs/Math/Utils'
import {ZenComponentGroup, ZenEvents} from '../Component'
import {contextMenuStore} from '../../../store/ContextMenuStore'
import {ContextActionRemoveFile} from '../../../store/ContextMenuStore/Actions'

export class ZenGridEvents extends ZenEvents<ZenGrid> {
  onMouseWheel(event: WheelEvent) {
    const factor = event.deltaY > 0 ? -1 : 1
    this.component.scroll += 50 * factor
  }

  onMouseDown(event: MouseEvent) {
    this.component.images.forEach(item => {
      const offset = 0

      const collide = item.transform.isCollide(Vector2.create(event.offsetX, event.offsetY + offset))

      if (collide) {
        if (event.button === 0)
          item.file.loadUrl().then(url => {
            imagePopupStore.show(url)
          })

        if (event.button === 2) {

          contextMenuStore.showActions([
            new ContextActionRemoveFile(item.file, () => {
              this.component.removeImage(item)
            })
          ])

        }
      }
    })
  }

  onResizeCanvas(oldSize: Vector2, newSize: Vector2) {
    this.component.resize()
  }
}

export class ZenGrid extends ZenComponentGroup<ZenImage> {
  private _images: ZenImage[] = []
  private _colCount: number = 4
  private _currentOffset: number = 0
  private _sizes: Record<number, number> = {}
  private _gap: number = 0
  private _scroll: number = 0
  private _isLoaded: boolean = true
  events = new ZenGridEvents()
  maxScroll: number = 0

  get images() {
    return this._images
  }
  set scroll(value: number) {
    this.updateMaxScroll()

    this._scroll = value
    this.updateClip(value)
  }

  get scroll() {
    return this._scroll
  }

  private updateMaxScroll() {
    this.maxScroll = max(Object.values(this._sizes))
    this.updateClip(this.scroll)
    return this.maxScroll
  }

  updateClip(offset: number) {
    const {height} = this.canvas

    for (const image of this._images) {
      const rect = image.transform.rect

      const top = rect.bottom + offset > -500
      const bottom = rect.top + (offset - height) < 500
      image.isEnable = top && bottom
    }
  }

  async loadImages(images: ZenImage[]) {
    this._isLoaded = false
    for (const image of images) {
      await image.load()
      this.update()
    }
    this._isLoaded = true
  }

  setImages(images: ExternalFile[]) {
    if (!this._isLoaded) return
    this.scroll = 0
    this.clear()

    // @ts-ignore
    global.gc()

    this._images = images.map(image => new ZenImage().setFile(image as ExternalFile))
    this.addComponent(this._images)
    this.loadImages(this._images)
  }

  removeImage(image: ZenImage) {
    this._images = this._images.filter(item => item.id !== image.id)
    this._children = this._children.filter(item => item.id !== image.id)
    this.update()
  }

  update() {
    let col = 0
    const gap = this._gap
    const sizes: Record<number, number> = {}

    for (let col = 0; col < this._colCount; col++) {
      sizes[col] = 0
    }

    this._images.forEach(item => {
      item.setWidth(this.canvas.width / this._colCount - gap)

      const {position, size} = item.transform

      position.x = (size.x + gap) * col + gap / 2
      position.y = sizes[col]

      sizes[col] += size.y + gap

      col += 1
      if (col >= this._colCount)
        col = 0
    })

    this._sizes = sizes
  }

  resize() {
    this.update()
    const oldMaxScroll = this.maxScroll
    const newMaxScroll = this.updateMaxScroll()
    const newScroll = (this.scroll / oldMaxScroll) * newMaxScroll

    if (!isFinite(newScroll)) {
      return
    }

    this._currentOffset = newScroll
    this.scroll = newScroll
  }

  setColumns(colCount: number) {
    if (colCount === this._colCount) return
    this._colCount = colCount
    this.update()
    this.updateMaxScroll()
  }

  setGap(value: number) {
    if (value === this._gap) return
    this._gap = value
    this.update()
    this.updateMaxScroll()
  }

  protected render(): void {
    this._currentOffset = lerp(this._currentOffset, this.scroll, .05)
    const offset = this._currentOffset

    this.transform.position.y = offset

    this.ctx.font = '48px arial'
    this.ctx.fillText(`${offset}`, 0, 50)
  }
}
import {ZenImage} from './ZenImage'
import {max} from 'mathjs'
import {ExternalFile} from '../../../Libs/Files/files'
import {imagePopupStore} from '../../../Store/ImageViewerStore/ImagePopupStore'
import {Vector2} from '../../../Libs/Math/Vector2'
import {lerp} from '../../../Libs/Math/Utils'
import {ZenComponentGroup, ZenEvents} from '../Component'
import {contextMenuStore} from '../../../Store/ContextMenuStore'
import {ContextActionRemoveFile, ContextActionShowFile} from '../../../Store/ContextMenuStore/Actions'

function contextMenuGrid(grid: ZenGrid, item: ZenImage) {
  return [
    new ContextActionRemoveFile(item.file, () => {
      grid.removeImage(item)
    }),
    new ContextActionShowFile(item.file)
  ]
}

export class ZenGridEvents extends ZenEvents<ZenGrid> {
  onMouseWheel(event: WheelEvent) {
    const factor = event.deltaY > 0 ? -1 : 1
    this.component.smoothScroll += 50 * factor
  }

  onMouseDown(event: MouseEvent) {
    this.component.images.forEach(item => {
      const offset = 0

      const collide = item.transform.isCollide(Vector2.create(event.offsetX, event.offsetY + offset))

      if (collide) {
        if (event.button === 0) {
          item.file.loadUrl().then(url => {
            imagePopupStore.show(url)
          })
        }

        if (event.button === 2) {
          contextMenuStore.showActions(contextMenuGrid(this.component, item))
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
  private _smoothScroll: number = 0
  private _isLoaded: boolean = true
  events = new ZenGridEvents()
  maxScroll: number = 0

  get images() {
    return this._images
  }

  set smoothScroll(value: number) {
    this.updateMaxScroll()

    this._smoothScroll = value
    this.updateClip(value)
  }

  get smoothScroll() {
    return this._smoothScroll || 0
  }

  set scroll(value: number) {
    this._smoothScroll = value
    this._currentOffset = value
  }

  private updateMaxScroll() {
    this.maxScroll = max(Object.values(this._sizes))
    this.updateClip(this.smoothScroll)
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
    this.scroll = 1
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
    image.destroy()
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
    const newScroll = (this.smoothScroll / oldMaxScroll) * newMaxScroll

    if (!isFinite(newScroll)) {
      return
    }

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
    this._currentOffset = lerp(this._currentOffset, this.smoothScroll, .05)

    this.transform.position.y = this._currentOffset
  }
}
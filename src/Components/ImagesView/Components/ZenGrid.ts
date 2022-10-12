import {ZenImage} from './ZenImage'
import {ExternalFile} from '../../../Libs/Files/files'
import {imagePopupStore} from '../../../Store/ImageViewerStore/ImagePopupStore'
import {Vector2} from '../../../Libs/Math/Vector2'
import {lerp} from '../../../Libs/Math/Utils'
import {ZenComponentGroup, ZenEvents} from '../Component'
import {contextMenuStore} from '../../../Store/ContextMenuStore'
import {ContextActionRemoveFile, ContextActionShowFile} from '../../../Store/ContextMenuStore/Actions'

export class ImageAnchor {
  image?: ZenImage
  offset: number = 0

  setImage(image: ZenImage, offset: number = 0) {
    this.image = image
    this.offset = offset
  }

  toImage(): number {
    if (this.image === undefined) {
      return 0
    }
    const transform = this.image.transform
    return -transform.rect.top + (this.offset * transform.size.y)
  }
}

export interface ZenGridOptions {
  gap: number
  colCount: number
}

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
  private _currentOffset: number = 0
  private _sizes: Record<number, number> = {}
  private _smoothScroll: number = 0
  private _isLoaded: boolean = true
  private _grid: Record<number, ZenImage[]> = []
  private _anchor = new ImageAnchor()
  private _options: ZenGridOptions = {gap: 0, colCount: 4}
  events = new ZenGridEvents()

  get images() {
    return this._images
  }

  set smoothScroll(value: number) {
    this._smoothScroll = value
    this.findAnchor(value)
    this.updateClip(value)
  }

  get smoothScroll() {
    return this._smoothScroll || 0
  }

  set scroll(value: number) {
    this._smoothScroll = value
    this._currentOffset = value
    this.updateClip(value)
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

  findAnchor(value: number) {
    for (const item of this._grid[0]) {
      const b = item.transform.rect.bottom + value > 0
      const t = item.transform.rect.top + value < 0
      const isCollide = t && b


      if (isCollide) {
        const imageOffset = (item.transform.position.y + this._smoothScroll) / item.transform.size.y
        this._anchor.setImage(item, imageOffset)
      }
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
    image.destroy()
    this.update()
  }

  update() {
    let col = 0
    const {gap, colCount} = this._options
    const sizes: Record<number, number> = {}
    const grid: Record<number, ZenImage[]> = {}

    for (let col = 0; col < colCount; col++) {
      sizes[col] = 0
      grid[col] = []
    }

    this._images.forEach(item => {
      item.setWidth(this.canvas.width / colCount - gap)

      const {position, size} = item.transform

      position.x = (size.x + gap) * col + gap / 2
      position.y = sizes[col]

      sizes[col] += size.y + gap
      grid[col].push(item)

      col += 1
      if (col >= colCount)
        col = 0
    })

    this._sizes = sizes
    this._grid = grid
  }

  resize() {
    this.update()
    this.scroll = this._anchor.toImage()
  }

  setOptions(options: Partial<ZenGridOptions>) {
    Object.entries(options).forEach(([key, newValue]) => {
      const oldValue = this._options[key as keyof ZenGridOptions]
      if (newValue === oldValue) return
      this._options[key as keyof ZenGridOptions] = newValue
    })
    this.update()
  }

  protected render(): void {
    this._currentOffset = lerp(this._currentOffset, this.smoothScroll, .05)

    this.transform.position.y = this._currentOffset
  }
}
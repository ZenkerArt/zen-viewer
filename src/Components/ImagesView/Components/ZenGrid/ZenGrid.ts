import {ExternalFile} from '@Libs/Files/Files'
import {Vector2} from '@Libs/Math'
import {ZenComponentGroup, ZenEvents} from '../../Component'
import {contextMenuStore, imagePopupStore} from '@StoreIndex'
import {ContextActionRemoveFile, ContextActionShowFile} from '@Store/ContextMenuStore/Actions'
import {ZenGridScroll} from './ZenGridScroll'
import {ZenImage} from '../'


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
    this.component.scroll.smoothScroll += 100 * factor
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

  onScroll(value: number, smooth: boolean) {
    const grid = this.component
    if (smooth) {
      grid.findAnchor()
    }
    grid.updateClip()
  }
}

export class ZenGrid extends ZenComponentGroup<ZenImage> {
  private _images: ZenImage[] = []
  private _isLoaded: boolean = true
  private _grid: Record<number, ZenImage[]> = []
  private _options: ZenGridOptions = {gap: 0, colCount: 4}
  readonly scroll: ZenGridScroll
  events = new ZenGridEvents()

  constructor() {
    super()
    this.scroll = new ZenGridScroll(this.events)
  }

  get images() {
    return this._images
  }

  updateClip() {
    const offset = this.scroll.scroll
    const {height} = this.canvas

    for (const image of this._images) {
      const rect = image.transform.rect

      const top = rect.bottom + offset > -500
      const bottom = rect.top + (offset - height) < 500
      image.isEnable = top && bottom
    }
  }

  findAnchor() {
    const value = this.scroll.scroll
    for (const item of this._grid[0]) {
      const b = item.transform.rect.bottom + value
      const t = item.transform.rect.top + value
      const isCollide = t < 0 && b > 0

      if (isCollide) {
        this.scroll.savePositionRelativeImage({
          image: item,
          offset: t / item.transform.size.y,
          smooth: false
        })
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
    this._grid = grid
  }

  resize() {
    this.update()
    this.scroll.restorePosition()
  }

  setOptions(options: Partial<ZenGridOptions>) {
    Object.entries(options).forEach(([key, newValue]) => {
      const oldValue = this._options[key as keyof ZenGridOptions]
      if (newValue === oldValue) return
      this._options[key as keyof ZenGridOptions] = newValue
    })
    this.update()
    this.scroll.restorePosition()
  }

  protected render(): void {
    this.scroll.update()
    this.transform.position.y = this.scroll.smoothScroll
  }
}
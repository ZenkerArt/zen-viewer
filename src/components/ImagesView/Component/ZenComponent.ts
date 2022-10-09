import {Vector2} from '../../../libs/Math/Vector2'
import {ZenTransform} from './ZenTransform'
import {ZenCanvas} from './ZenCanvas'

export abstract class ZenEvents<T extends ZenComponent> {
  component!: T

  constructor() {
    this.onMouseWheel = this.onMouseWheel.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onResizeCanvas = this.onResizeCanvas.bind(this)
  }

  setComponent(component: T) {
    this.component = component
  }

  onMouseDown(event: MouseEvent) {}
  onMouseUp(event: MouseEvent) {}
  onMouseWheel(event: WheelEvent) {}
  onResizeCanvas(oldSize: Vector2, newSize: Vector2) {}

  subscribe(element: HTMLElement) {
    element.addEventListener('mousedown', this.onMouseDown)
    element.addEventListener('mousedown', this.onMouseUp)
    element.addEventListener('wheel', this.onMouseWheel)
  }

  unsubscribe(element: HTMLElement) {
    element.removeEventListener('mousedown', this.onMouseDown)
    element.removeEventListener('mousedown', this.onMouseUp)
    element.removeEventListener('wheel', this.onMouseWheel)
  }
}

export abstract class ZenComponent {
  protected _isDestroyed: boolean = false
  protected events?: ZenEvents<ZenComponent> = undefined
  readonly transform: ZenTransform = new ZenTransform()
  canvas!: ZenCanvas
  isEnable: boolean = true

  setCanvas(canvas: ZenCanvas) {
    this.canvas = canvas
    this.mount()
    return this
  }

  get isDestroyed() {
    return this._isDestroyed
  }

  get ctx() {
    return this.canvas.ctx
  }

  protected abstract render(): void

  protected onDestroy() {
  }

  tick() {
    this.render()
    return this
  }

  mount() {
    this.events?.setComponent(this)
    this.events?.subscribe(this.canvas.element)
    return this
  }

  destroy() {
    this.onDestroy()
    this.events?.unsubscribe(this.canvas.element)
    this._isDestroyed = true
    return this
  }
}
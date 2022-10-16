import {ZenTransform} from './ZenTransform'
import {ZenCanvasInfo} from './ZenCanvasInfo'
import {ZenEvents} from '@Libs/Canvas/Component/ZenEvents'


export abstract class ZenComponent {
  protected _isDestroyed: boolean = false
  readonly transform: ZenTransform = new ZenTransform()
  private _id: number = 0
  canvas!: ZenCanvasInfo
  isEnable: boolean = true
  events?: ZenEvents<ZenComponent> = undefined

  get uid() {
    return this._id
  }

  set uid(value: number) {
    this._id = value
  }

  setCanvas(canvas: ZenCanvasInfo) {
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
    this.events?.setOwner(this)
    this.events?.subscribe(this.canvas.element)
    this._isDestroyed = false
    return this
  }

  destroy() {
    this.onDestroy()
    this.events?.unsubscribe(this.canvas.element)
    this._isDestroyed = true
    return this
  }
}
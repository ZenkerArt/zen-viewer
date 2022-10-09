import {ZenComponent} from './ZenComponent'

export abstract class ZenComponentGroup<T extends ZenComponent = ZenComponent> extends ZenComponent {
  protected _children: T[] = []
  private _counter: number = 0

  constructor() {
    super()
    this.addComponent = this.addComponent.bind(this)
  }

  addComponent(component: T | T[]) {
    if (Array.isArray(component)) {
      component.forEach(this.addComponent)
      return this
    }

    component.setCanvas(this.canvas)
    component.uid = this._counter++
    this._children.push(component)
    return this
  }

  tick() {
    this.render()
    for (const child of this._children) {

      if (!child.isEnable) {
        continue
      }
      child.transform.offset.set(this.transform.position)
      child.tick()
    }
    return this
  }

  destroy(): this {
    this._children.forEach(child => child.destroy())
    return super.destroy()
  }

  mount(): this {
    this._children.forEach(child => child.mount())
    return super.mount()
  }

  clear() {
    this._children.forEach(child => child.destroy())
    this._children = []
    this._counter = 0
  }
}
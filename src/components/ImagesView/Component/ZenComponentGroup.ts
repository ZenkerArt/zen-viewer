import {ZenComponent} from './ZenComponent'

export abstract class ZenComponentGroup extends ZenComponent {
  private _children: ZenComponent[] = []

  constructor() {
    super()
    this.addComponent = this.addComponent.bind(this)
  }

  addComponent(component: ZenComponent | ZenComponent[]) {
    if (Array.isArray(component)) {
      component.forEach(this.addComponent)
      return this
    }

    component.setCanvas(this.canvas)
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
  }
}
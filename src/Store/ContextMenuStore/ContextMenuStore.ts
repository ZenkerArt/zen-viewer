import {action, makeObservable, observable} from 'mobx'
import {Vector2} from '@Libs/Math'
import {ContextActionAlwaysOnTop} from '@Store/ContextMenuStore/Actions'
import {ContextMenuAction} from '@Store/ContextMenuStore/ContextMenuAction'
import {ContextActionReload} from '@Store/ContextMenuStore/Actions/ContextActionReload'

export class ContextMenuStore {
  globalActions: ContextMenuAction[] = [
    new ContextActionAlwaysOnTop(),
    new ContextActionReload(),
  ]
  @observable actions: ContextMenuAction[] = []
  @observable isActive: boolean = false
  @observable pos: Vector2 = Vector2.create()

  constructor() {
    makeObservable(this)
  }

  @action
  setPos(pos: Vector2) {
    this.pos = pos
  }

  @action
  setActive(value: boolean) {
    if (!value) {
      this.actions = []
    }
    this.isActive = value
  }

  @action
  addAction(action: ContextMenuAction) {
    this.actions.push(action)
  }

  @action
  setActions(actions: ContextMenuAction[]) {
    this.actions = actions
  }

  @action
  showActions(actions: ContextMenuAction[]) {
    this.setActions(actions)
    this.isActive = true
  }
}
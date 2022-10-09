import {action, makeObservable, observable} from 'mobx'
import {MatIconCode} from '../../Components/MatIcon/MatIconCode'
import {Vector2} from '../../Libs/Math/Vector2'
import {contextMenuStore} from './index'

type BoolFunc = boolean | void | Promise<boolean> | Promise<never>

export abstract class ContextMenuAction {
  icon?: MatIconCode
  label: string = ''

  hideMenu() {
    contextMenuStore.setActive(false)
  }

  poll(): BoolFunc {
    return true
  }

  abstract execute(): BoolFunc
}

export class ContextMenuStore {
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
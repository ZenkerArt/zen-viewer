import {action, makeObservable, observable} from 'mobx'
import {MatIconCode} from '../../components/MatIcon/MatIconCode'

type BoolFunc = boolean | void | Promise<boolean> | Promise<never>

export abstract class ContextMenuAction {
  icon?: MatIconCode
  label: string = ''

  poll(): BoolFunc {
    return true
  }

  abstract execute(): BoolFunc
}

export class ContextMenuStore {
  actions: ContextMenuAction[] = []

  constructor() {
    makeObservable(this, {
      actions: observable,
      addAction: action,
      setActions: action
    })

    this.addAction = this.addAction.bind(this)
    this.setActions = this.setActions.bind(this)
  }

  addAction(action: ContextMenuAction) {
    this.actions.push(action)
  }

  setActions(actions: ContextMenuAction[]) {
    this.actions = actions
  }
}
import {MatIconCode} from '@Components/MatIcon/MatIconCode'
import {contextMenuStore} from '@StoreIndex'

type BoolFunc = boolean | void | Promise<boolean> | Promise<never>

export abstract class ContextMenuAction {
  icon?: MatIconCode
  label: string = ''
  showState: boolean = false
  isActive: boolean = false

  onChangeState(value: boolean) {

  }

  changeState(value: boolean) {
    this.onChangeState(value)
    this.isActive = value
  }

  hideMenu() {
    contextMenuStore.setActive(false)
  }

  poll(): BoolFunc {
    return true
  }

  abstract execute(): BoolFunc
}
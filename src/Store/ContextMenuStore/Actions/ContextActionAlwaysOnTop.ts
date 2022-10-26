import {ContextMenuAction} from '@Store/ContextMenuStore/ContextMenuAction'
import {MatIconCode} from '@Components/MatIcon/MatIconCode'
import {electronAPI} from '@Libs/ElectronAPI'
import {alertStore} from '@StoreIndex'

export class ContextActionAlwaysOnTop extends ContextMenuAction {
  label = 'Поверх всех окон'
  icon: MatIconCode = MatIconCode.brandingWatermark
  switcher = false
  showState = true

  execute() {
    this.switcher = !this.switcher
    electronAPI.thisWindow.alwaysOnTop(this.switcher)
    this.changeState(this.switcher)
    alertStore.alert({
      text: 'Поверх всех окон',
      state: this.switcher,
      icon: MatIconCode.brandingWatermark
    })
    this.hideMenu()
  }
}
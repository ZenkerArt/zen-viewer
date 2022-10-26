import {ContextMenuAction} from '@Store/ContextMenuStore/ContextMenuAction'
import {MatIconCode} from '@Components/MatIcon/MatIconCode'

export class ContextActionReload extends ContextMenuAction {
  label = 'Очистить память'
  icon: MatIconCode = MatIconCode.brandingWatermark

  execute() {
    window.location.href = '/'
    this.hideMenu()
  }
}
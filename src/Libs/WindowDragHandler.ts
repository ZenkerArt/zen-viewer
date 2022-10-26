import {Vector2, VMath} from '@Libs/Math'
import {appStore} from '@StoreIndex'
import {AppState} from '@Store/AppStore'
import {electronAPI} from '@Libs/ElectronAPI'

export class WindowDragHandler {
  lastClick = Vector2.create()
  isStart = false
  isDown = false

  onMouseDown = (e: MouseEvent) => {
    if (e.button !== 2) return
    this.lastClick = Vector2.createFromEvent(e)
    this.isDown = true
  }
  onMouseUp = (e: MouseEvent) => {
    if (e.button !== 2) return

    electronAPI.thisWindow.stopMove()
    this.isStart = false
    this.isDown = false
    appStore.rollbackState()
  }

  onMouseMove = (e: MouseEvent) => {
    const mouse = Vector2.createFromEvent(e)
    const length = VMath.sub(this.lastClick, mouse).length()

    if (length > 20 && !this.isStart && this.isDown) {
      this.isStart = true
      electronAPI.thisWindow.startMove()
      appStore.setState(AppState.windowMove)
    }
  }

  subscribe() {
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('mousemove', this.onMouseMove)
    return this
  }
}

export const windowDragHandler = new WindowDragHandler().subscribe()

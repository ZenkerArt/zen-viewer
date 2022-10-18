import {Vector2, VMath} from '@Libs/Math'

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
    //@ts-ignore
    window.electronAPI.stopMove()
    this.isStart = false
    this.isDown = false
  }

  onMouseMove = (e: MouseEvent) => {
    const mouse = Vector2.createFromEvent(e)
    const length = VMath.sub(this.lastClick, mouse).length()

    if (length > 20 && !this.isStart && this.isDown) {
      this.isStart = true
      //@ts-ignore
      window.electronAPI.startMove()
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

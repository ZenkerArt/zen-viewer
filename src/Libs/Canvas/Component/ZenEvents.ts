import {Vector2} from '@Libs/Math'
import {ZenComponent} from '@Libs/Canvas/Component/ZenComponent'

const events: ZenEvent[] = []

interface ZenEvent {
  functionName: keyof ZenEvents
  eventName: keyof DocumentEventMap
}

function subDomEvent(event: keyof DocumentEventMap) {
  return (target: any, propertyKey: keyof ZenEvents) => {
    events.push({
      functionName: propertyKey,
      eventName: event
    })
  }
}

export abstract class ZenEvents<T = ZenComponent> {
  owner!: T

  constructor() {
    for (let event of events) {
      const func = this[event.functionName]
      if (typeof func !== 'function') {
        continue
      }
      // @ts-ignore
      this[event.functionName] = func.bind(this)
    }
    this.onResizeCanvas = this.onResizeCanvas.bind(this)
  }

  setOwner(owner: T) {
    this.owner = owner
    return this
  }

  @subDomEvent('touchstart')
  onTouchStart(event: TouchEvent) {
  }

  @subDomEvent('touchend')
  onTouchEnd(event: TouchEvent) {
  }

  @subDomEvent('touchmove')
  onTouchMove(event: TouchEvent) {
  }

  @subDomEvent('mousemove')
  onMouseMove(event: MouseEvent) {}

  @subDomEvent('mousedown')
  onMouseDown(event: MouseEvent) {
  }

  @subDomEvent('mouseup')
  onMouseUp(event: MouseEvent) {
  }

  @subDomEvent('wheel')
  onWheel(event: WheelEvent) {
  }

  onResizeCanvas(oldSize: Vector2, newSize: Vector2) {
  }

  subscribe(element: HTMLElement) {
    for (let event of events) {
      const func = this[event.functionName]
      if (typeof func !== 'function') {
        continue
      }
      element.addEventListener(event.eventName, func as any)
    }
  }

  unsubscribe(element: HTMLElement) {
    for (let event of events) {
      const func = this[event.functionName]
      if (typeof func !== 'function') {
        continue
      }
      element.removeEventListener(event.eventName, func as any)
    }
  }
}
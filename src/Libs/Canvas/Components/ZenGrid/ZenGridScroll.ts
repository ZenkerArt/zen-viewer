import {ZenImage} from '../ZenImage'
import {lerp} from '@Libs/Math'
import {ZenGridEvents} from './ZenGrid'

interface ZenScrollTo {
  image: ZenImage
  offset?: number
  smooth?: boolean
}

export class ZenGridScroll {
  private _scrollTo: number = 0
  private _smoothScroll: number = 0
  private _savePosition: ZenScrollTo = {image: new ZenImage()}
  private readonly _events: ZenGridEvents

  constructor(events: ZenGridEvents) {
    this._events = events
  }

  get smoothScroll() {
    return this._smoothScroll
  }

  set smoothScroll(value: number) {
    this.scrollY(value, true)
  }

  get scroll() {
    return this._scrollTo
  }

  set scroll(value: number) {
    this.scrollY(value, false)
  }

  savePositionRelativeImage(options: ZenScrollTo) {
    this._savePosition = options
  }

  restorePosition() {
    this.toImage(this._savePosition)
  }

  scrollY(y: number, smooth: boolean = true) {
    if (smooth) {
      this._scrollTo = y
    }
    else {
      this._smoothScroll = y
      this._scrollTo = y
    }
    this._events.onScroll?.(y, smooth)
  }

  toImage(options: ZenScrollTo) {
    const offset = options.offset || 0
    const {image, smooth} = options

    const transform = image.transform
    const y = -transform.rect.top + (offset * transform.size.y)
    this.scrollY(y, smooth)
  }

  update() {
    this._smoothScroll = lerp(this._smoothScroll, this._scrollTo, .1)
  }
}
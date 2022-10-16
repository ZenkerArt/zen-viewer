import React from 'react'
import styles from './ImagePopup.module.scss'
import clsx from 'clsx'
import {observer} from 'mobx-react'
import {imagePopupStore} from '@StoreIndex'
import {Vector2, VMath} from '@Libs/Math'
import {ZenEvents} from '@Libs/Canvas/Component'

interface ImagePopupState {
  pos: Vector2
  size: Vector2
}

class Events extends ZenEvents<ImageControl> {
  isDown: boolean = false
  offset: Vector2 = Vector2.create()
  isMove: boolean = false
  isFirst: boolean = true
  isDownZoom: boolean = false
  lastZoom: Vector2 = Vector2.create()
  lastScale: number = 1


  onWheel(event: WheelEvent) {
    const mouse = Vector2.createFromEvent(event)
    const scale = this.owner.scale
    this.owner.zoomToPoint(mouse, event.deltaY < 0 ? scale * 1.1 : scale / 1.1)
  }

  onMouseDown(event: MouseEvent | TouchEvent) {
    const mouse: Vector2 = Vector2.createFromEvent(event)
    this.lastScale = this.owner.scale
    if ('button' in event && event.button !== 0) {
      this.isDownZoom = true
      this.lastZoom = Vector2.createFromEvent(event)
      return
    }

    this.isDown = true
    this.isFirst = false
    this.offset = VMath.sub(mouse, this.owner.pos)
    if (this.isMove) {
      this.isMove = false
      return
    }

  }

  onMouseUp(event: MouseEvent | TouchEvent) {
    if ('button' in event && event.button !== 0) {
      this.isDownZoom = false
      return
    }

    this.isDown = false
    if (!this.isMove && !this.isFirst) {
      imagePopupStore.hide()
      this.isFirst = true
    }
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (this.isDownZoom) {
      const size = VMath.sub(this.lastZoom, Vector2.createFromEvent(event))
      const {innerWidth, innerHeight} = window
      const center = VMath.div(Vector2.create(innerWidth, innerHeight), 2)

      this.owner.zoomToPoint(center, this.lastScale + (size.x / window.innerWidth) * this.owner.scale * 2)
      return
    }

    if (!this.isDown) return
    const mouse: Vector2 = Vector2.createFromEvent(event)
    this.isMove = true
    this.owner.pos.set(VMath.sub(mouse, this.offset))
    this.owner.update()
  }

  onTouchMove = this.onMouseMove
  onTouchStart = this.onMouseDown
  onTouchEnd = this.onMouseUp
}

class ImageControl {
  readonly pos: Vector2 = Vector2.create()
  readonly originalSize: Vector2 = Vector2.create()
  readonly size: Vector2 = Vector2.create()
  private _scale: number = 1
  private _events: Events = new Events().setOwner(this)
  image!: HTMLImageElement
  element!: HTMLDivElement

  get scale() {
    return this._scale
  }

  set scale(value) {
    this._scale = value
    this.size.set(VMath.mul(this.originalSize, value))
  }

  private updateSize() {
    const windowSize = Vector2.create(window.innerWidth, window.innerHeight)
    const aspectX = this.image.naturalWidth / this.image.naturalHeight
    const aspectY = this.image.naturalHeight / this.image.naturalWidth

    let x = windowSize.x
    let y = windowSize.x * aspectY

    if (y > windowSize.y) {
      x = windowSize.y * aspectX
      y = windowSize.y
    }

    const imageSize = Vector2.create(x, y)

    this.pos.x = windowSize.x / 2 - imageSize.x / 2
    this.pos.y = windowSize.y / 2 - imageSize.y / 2

    this.originalSize.set(imageSize)
    this.size.set(imageSize)
  }

  private onLoad() {
    this._scale = 1
    this.pos.fill(0)
    this.size.fill(1)
    this.updateSize()
    this.update()
  }

  update() {
    Object.assign(this.image.style, {
      width: `${this.size.x}px`,
      height: `${this.size.y}px`,
      left: `${this.pos.x}px`,
      top: `${this.pos.y}px`,
      imageRendering: this.scale > 5 ? 'pixelated' : 'auto'
    })
  }

  zoomToPoint(point: Vector2, scale: number) {
    const oldScale = this.scale
    const newScale = scale

    const offset = VMath.div(VMath.sub(point, this.pos), oldScale)

    this.pos.set(
      point.x - offset.x * newScale,
      point.y - offset.y * newScale)
    this.scale = newScale

    this.update()
  }

  setImage(image: HTMLImageElement) {
    this.image = image
    this.image.onload = () => this.onLoad()
    if (image.complete) {
      this.onLoad()
    }
  }

  subscribe() {
    this._events.subscribe(this.element)
  }

  unsubscribe() {
    this._events.unsubscribe(this.element)
  }
}

@observer
class ImagePopup extends React.Component<any, ImagePopupState> {
  image?: React.RefObject<HTMLImageElement> = React.createRef()
  element?: React.RefObject<HTMLImageElement> = React.createRef()
  imageControl: ImageControl = new ImageControl()

  componentDidMount() {
    if (this.image === undefined || this.element === undefined) return
    this.imageControl.element = this.element.current as HTMLDivElement
    this.imageControl.setImage(this.image.current as HTMLImageElement)
    this.imageControl.subscribe()
  }

  componentWillUnmount() {
    this.imageControl.unsubscribe()
  }

  render() {
    return (<div
      className={clsx(styles.imageViewer, {[styles.show]: imagePopupStore.isShow})}
      ref={this.element}
      onTransitionEnd={() => imagePopupStore.removeAllImages()}
    >
      <img src={imagePopupStore.url}
           alt=""
           style={{
             position: 'absolute'
             // transition: 'left .1s, top .1s, width .1s, height .1s'
           }}
           ref={this.image}/>
    </div>)
  }
}

export default ImagePopup

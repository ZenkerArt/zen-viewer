import React from 'react'
import styles from './ImagePopup.module.scss'
import clsx from 'clsx'
import {observer} from 'mobx-react'
import {imagePopupStore} from '../../Store/ImageViewerStore/ImagePopupStore'
import {Vector2, VMath} from '../../Libs/Math/Vector2'

interface ImagePopupState {
  pos: Vector2
  size: Vector2
}


class ImageControl {
  readonly pos: Vector2 = Vector2.create()
  readonly originalSize: Vector2 = Vector2.create()
  readonly size: Vector2 = Vector2.create()
  private _scale: number = 1
  private _point = document.createElement('div')
  private _point2 = document.createElement('div')
  private _isDown = false
  private _offset: Vector2 = Vector2.create()
  image!: HTMLImageElement
  element!: HTMLDivElement

  constructor() {
    this.onWheel = this.onWheel.bind(this)
  }

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

  setImage(image: HTMLImageElement) {
    this.image = image
    this.image.onload = () => this.onLoad()
    if (image.complete) {
      this.onLoad()
    }

    this.element.appendChild(this._point)
    this.element.appendChild(this._point2)
  }

  onWheel(event: WheelEvent) {
    const mouse = Vector2.create(event.clientX, event.clientY)
    const oldScale = this.scale
    const newScale = event.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1

    const offset = VMath.div(VMath.sub(this.pos, mouse), oldScale)

    this.pos.set(
      mouse.x - offset.x * newScale,
      mouse.y - offset.y * newScale)
    this.scale = newScale

    this.update()
  }

  onMouseDown(event: MouseEvent) {
    this._isDown = true
    const mouse = Vector2.create(event.clientX, event.clientY)
    this._offset = VMath.sub(mouse, this.pos)
  }

  onMouseUp() {
    this._isDown = false
  }

  onMouseMove(event: MouseEvent) {
    if (!this._isDown) return
    const mouse = Vector2.create(event.clientX, event.clientY)
    this.pos.set(VMath.sub(mouse, this._offset))
    this.update()
  }

  subscribe() {
    this.element.addEventListener('wheel', this.onWheel.bind(this))
    this.element.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.element.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.element.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  unsubscribe() {
    this.element.removeEventListener('wheel', this.onWheel.bind(this))
    this.element.removeEventListener('mousedown', this.onMouseDown.bind(this))
    this.element.removeEventListener('mouseup', this.onMouseUp.bind(this))
    this.element.removeEventListener('mousemove', this.onMouseMove.bind(this))
  }
}

@observer
class ImagePopup extends React.Component<any, ImagePopupState> {
  image?: React.RefObject<HTMLImageElement> = React.createRef()
  element?: React.RefObject<HTMLImageElement> = React.createRef()
  imageControl: ImageControl = new ImageControl()

  onWheel(event: WheelEvent) {
    this.imageControl?.onWheel(event)
  }

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
      onClick={() => imagePopupStore.hide()}
      ref={this.element}
      onTransitionEnd={() => imagePopupStore.removeAllImages()}
    >
      <img src={imagePopupStore.url}
           alt=""
           style={{
             position: 'absolute',
             // transition: 'left .1s, top .1s, width .1s, height .1s'
           }}
           ref={this.image}/>
    </div>)
  }
}

export default ImagePopup

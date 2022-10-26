import React from 'react'
import {Vector2} from '@Libs/Math'
import {ZenCanvasInfo, ZenComponent} from '@Libs/Canvas/Component'

export type ZenCanvasProps = {
  component: ZenComponent,
  style?: React.CSSProperties
  className?: string
}

class ZenCanvas extends React.Component<ZenCanvasProps, any> {
  canvas: React.RefObject<HTMLCanvasElement>
  canvasInfo!: ZenCanvasInfo
  container: React.RefObject<HTMLDivElement>
  ctx!: CanvasRenderingContext2D
  resizeObserver: ResizeObserver
  isMount: boolean = true
  renderId: number = 0

  constructor(props: ZenCanvasProps) {
    super(props)
    this.canvas = React.createRef()
    this.container = React.createRef()
    this.resizeObserver = new ResizeObserver(this.resize.bind(this))
    this.renderLoop = this.renderLoop.bind(this)
  }

  getElements() {
    const canvas = this.canvas.current as HTMLCanvasElement
    const container = this.container.current as HTMLDivElement

    if (canvas === undefined || container === undefined) {
      throw new Error('Not found canvas')
    }
    return {canvas, container}
  }

  resize() {
    const {canvas, container} = this.getElements()
    const rect = container.getBoundingClientRect()

    const oldSize = Vector2.create(canvas.width, canvas.height)
    const newSize = Vector2.create(rect.width, rect.height)

    canvas.width = newSize.x
    canvas.height = newSize.y
    this.canvasInfo.width = newSize.x
    this.canvasInfo.height = newSize.y

    this.component.events?.onResizeCanvas(oldSize, newSize)
    this.renderTick()
  }

  get component() {
    return this.props.component
  }

  componentDidMount() {
    this.isMount = true

    const {canvas, container} = this.getElements()
    this.ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D
    this.canvasInfo = {
      ctx: this.ctx,
      width: canvas.width,
      height: canvas.height,
      element: canvas
    }
    this.resizeObserver.observe(container)

    this.component.setCanvas(this.canvasInfo)
    this.component.mount()
    this.resize()

    this.renderId = requestAnimationFrame(this.renderLoop)
  }

  componentWillUnmount() {
    this.isMount = false
    this.resizeObserver.disconnect()
    cancelAnimationFrame(this.renderId)
    this.component.destroy()
  }

  renderTick() {
    const {ctx, canvasInfo} = this
    ctx.getTransform()
    ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height)
    this.component.tick()
  }

  renderLoop() {
    if (!this.isMount) {
      return
    }
    this.renderTick()
    this.renderId = requestAnimationFrame(this.renderLoop)
  }

  render() {
    return (
      <div style={{
        position: 'relative',
        ...(this.props.style || {})
      }}
           ref={this.container}
           className={this.props.className}
      >
        <canvas ref={this.canvas} style={{
          position: 'absolute',
          display: 'block'
        }}></canvas>
      </div>
    )
  }
}

export default ZenCanvas

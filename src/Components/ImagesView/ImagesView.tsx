import React from 'react'
import styles from './ImagesView.module.scss'
import clsx from 'clsx'
import {ExternalFile} from '../../Libs/Files/files'
import {ZenGrid} from './Components/ZenGrid'
import {ZenCanvas} from './Component'
import {Vector2} from '../../Libs/Math/Vector2'

export type ImagesViewProps = {
  colCount: number
  gap: number
  images: ExternalFile[]
}

export type ImagesViewState = {}

class Canvas {
  private _destroy: boolean = false
  canvas!: HTMLCanvasElement
  ctx!: CanvasRenderingContext2D
  renderId: number = 0
  grid!: ZenGrid
  zenCanvas!: ZenCanvas

  constructor() {
    this.render = this.render.bind(this)
    this._render = this._render.bind(this)
  }

  resize(oldW: number, oldH: number, newW: number, newH: number) {
    Object.assign(this.zenCanvas, {
      width: newW,
      height: newH
    })

    this.grid.events?.onResizeCanvas(
      Vector2.create(oldW, oldH),
      Vector2.create(newW, newH)
    )
  }

  setImages(images: ExternalFile[]) {
    this.grid.setImages(images)
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.zenCanvas = {
      ctx: this.ctx,
      width: 0,
      height: 0,
      element: this.canvas
    }

    this.grid = new ZenGrid().setCanvas(this.zenCanvas)

  }

  getWH() {
    return [this.canvas.width, this.canvas.height]
  }

  render() {
    const [width, height] = this.getWH()
    const ctx = this.ctx
    ctx.clearRect(0, 0, width, height)

    this.grid.tick()
  }

  private _render() {
    this.render()
    if (!this._destroy) {
      this.renderId = requestAnimationFrame(this._render)
    }
  }

  start() {
    this._destroy = false
    this.renderId = requestAnimationFrame(this._render)
  }

  destroy() {
    this.grid.destroy()
    cancelAnimationFrame(this.renderId)
    this._destroy = true
  }
}

export class ImagesView extends React.Component<ImagesViewProps, ImagesViewState> {
  canvas: React.RefObject<HTMLCanvasElement>
  container: React.RefObject<HTMLDivElement>
  resizeObserver: ResizeObserver
  renderCanvas: Canvas = new Canvas()

  constructor(props: ImagesViewProps) {
    super(props)
    this.canvas = React.createRef()
    this.container = React.createRef()
    this.resizeObserver = new ResizeObserver(this.resize.bind(this))
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
    const oldW = canvas.width
    const oldH = canvas.height

    canvas.width = rect.width
    canvas.height = rect.height
    this.renderCanvas.resize(oldW, oldH, rect.width, rect.height)
    this.renderCanvas.render()
  }

  componentDidMount() {
    const {canvas} = this.getElements()
    this.renderCanvas.setCanvas(canvas)
    this.renderCanvas.start()

    this.resize()
  }

  componentWillUnmount() {
    const {container} = this.getElements()

    this.resizeObserver.disconnect()
    this.renderCanvas.destroy()
    this.resizeObserver.observe(container)
  }

  shouldComponentUpdate(nextProps: Readonly<ImagesViewProps>): boolean {
    this.renderCanvas.grid.setColumns(nextProps.colCount)
    this.renderCanvas.grid.setGap(nextProps.gap)
    let eq = true

    nextProps.images.forEach(item => {
      if (!eq) {
        return
      }
      this.renderCanvas.grid.images.forEach(oldItem => {
        if (oldItem.id === item.id) {
          eq = false
          return
        }
      })
    })

    if (eq) {
      this.renderCanvas.setImages(nextProps.images || [])
    }

    if (nextProps.images.length !== this.renderCanvas.grid.images.length) {
      this.renderCanvas.setImages(nextProps.images || [])
    }
    return true
  }

  render() {
    return (
      <div className={clsx(styles.imagesView)}
           style={{
             position: 'relative',
             height: '98vh'
           }}
           ref={this.container}
      >
        <canvas ref={this.canvas} style={{
          position: 'absolute'
        }}></canvas>
      </div>
    )
  }
}

export default ImagesView

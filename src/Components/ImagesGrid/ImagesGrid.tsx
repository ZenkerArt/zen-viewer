import React from 'react'
import styles from './ImagesGrid.module.scss'
import clsx from 'clsx'
import {ZenGrid, ZenImage} from '@Libs/Canvas/Components'
import ZenRange from '@Components/ZenRange/ZenRange'
import ZenCanvas from '@Components/ZenCanvas/ZenCanvas'
import {ZenTransform} from '@Libs/Canvas/Component'
import {Vector2} from '@Libs/Math'
import {alertStore, appStore} from '@StoreIndex'
import {observer} from 'mobx-react'
import {ZenImageLoader} from '@Libs/Canvas/Components/ZenGrid/ZenImageLoader'
import {AlertLoading} from '@Store/AlertStore'

export type GridControlsProps = {
  grid: ZenGrid
}

export type GridControlsState = {
  show: boolean
}

@observer
class ImagesGrid extends React.Component<GridControlsProps, GridControlsState> {
  ui: React.RefObject<HTMLDivElement> = React.createRef()
  alertLoading?: AlertLoading

  constructor(props: GridControlsProps) {
    super(props)

    this.state = {
      show: false
    }
  }
  onMouseOver = (event: React.MouseEvent) => {
    if (!this.ui.current?.contains(event.target as any)) {
      return
    }
    this.setState({
      show: false
    })
  }
  onMouseMove = (event: React.MouseEvent) => {
    const bounding = new ZenTransform()
    const {left, top, width} = event.currentTarget.getBoundingClientRect()
    const mouse = Vector2.create(event.clientX, event.clientY)
    const {current: ui} = this.ui
    const target = event.target as unknown as HTMLElement

    bounding.position.set(left, top)
    bounding.size.set(width, 50)

    let collide = bounding.isCollide(mouse)

    if (ui?.contains(target)) {
      collide = true
    }

    if (collide !== this.state.show) {
      this.setState({
        show: collide
      })
    }
  }

  onImageLoaded = (loader: ZenImageLoader, image: ZenImage) => {
    this.alertLoading?.setValue(loader.loadedImageCount)
  }
  onImageStart = (loader: ZenImageLoader, image: ZenImage[]) => {
    if (loader.imageCount === 0) return;
    this.alertLoading = alertStore.alertLoading(loader.imageCount)
  }
  onImageEnd = (loader: ZenImageLoader, image: ZenImage[]) => {
    this.alertLoading?.destroy()
  }

  componentDidMount() {
    this.props.grid.imageLoader.onImageLoaded.on(this.onImageLoaded)
    this.props.grid.imageLoader.onEndLoad.on(this.onImageEnd)
    this.props.grid.imageLoader.onStartLoad.on(this.onImageStart)
  }

  componentWillUnmount() {
    this.props.grid.imageLoader.onImageLoaded.off(this.onImageLoaded)
    this.props.grid.imageLoader.onEndLoad.off(this.onImageEnd)
    this.props.grid.imageLoader.onStartLoad.off(this.onImageStart)
  }

  render() {
    const {grid} = this.props
    const {show} = this.state
    const isShow = {[styles.show]: show && !appStore.isPaused}

    return (
      <div className={clsx(styles.imagesGrid)}
           onMouseMove={this.onMouseMove}
           onMouseLeave={this.onMouseOver}
      >
        <ZenCanvas component={grid} style={{
          width: '100vw',
          height: '100%'
        }}/>
        <div className={clsx(styles.ui, isShow)} ref={this.ui}>
          <div>
            <ZenRange min={1}
                      max={10}
                      defaultValue={4}
                      text={'Количество столбцов'}
                      onChange={value => grid.setOptions({colCount: value})}
                      style={{
                        width: '100%'
                      }}/>
          </div>
          <div>
            <ZenRange max={50}
                      text={'Расстояние между столбцами'}
                      onChange={value => grid.setOptions({gap: value})}
                      style={{
                        width: '100%'
                      }}/>
          </div>
        </div>
      </div>
    )
  }
}

export default ImagesGrid

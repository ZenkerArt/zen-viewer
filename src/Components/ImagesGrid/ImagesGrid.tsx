import React from 'react'
import styles from './ImagesGrid.module.scss'
import clsx from 'clsx'
import {ZenGrid} from '@Libs/Canvas/Components'
import ZenRange from '@Components/ZenRange/ZenRange'
import ZenCanvas from '@Components/ZenCanvas/ZenCanvas'
import {ZenTransform} from '@Libs/Canvas/Component'
import {Vector2} from '@Libs/Math'

export type GridControlsProps = {
  grid: ZenGrid
}

export type GridControlsState = {
  show: boolean
}


class ImagesGrid extends React.Component<GridControlsProps, GridControlsState> {
  ui: React.RefObject<HTMLDivElement> = React.createRef()

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

  render() {
    const {grid} = this.props

    return (
      <div className={clsx(styles.imagesGrid)}
           onMouseMove={this.onMouseMove}
           onMouseLeave={this.onMouseOver}
      >
        <ZenCanvas component={grid} style={{
          width: '100vw',
          height: '100%'
        }}/>

        <div className={clsx(styles.ui, {[styles.show]: this.state.show})} ref={this.ui}>
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

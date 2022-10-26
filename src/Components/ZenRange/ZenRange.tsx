import React from 'react'
import styles from './ZenRange.module.scss'
import clsx from 'clsx'

export type ZenRangeProps = {
  value?: number
  thinness?: number
  onChange?: (value: number) => void
  max?: number
  min?: number
  style?: React.CSSProperties
  className?: string
  text?: string
  defaultValue?: number
}

export type ZenRangeState = {
  thinness: number
  isDown: boolean
  value: number
}

class ZenRange extends React.Component<ZenRangeProps, ZenRangeState> {
  ref: React.RefObject<HTMLDivElement>
  lastTouch = 0
  lastValue = 0
  constructor(props: any) {
    super(props)
    this.ref = React.createRef()
    this.state = {
      thinness: 0,
      isDown: false,
      value: 0
    }
  }

  onMouseUp = () => {
    this.isDown = false
  }

  get isDown() {
    return this.state.isDown
  }

  set isDown(value: boolean) {
    this.setState({isDown: value})
  }

  get max() {
    return this.props.max || 1
  }

  get min() {
    return this.props.min || 0
  }

  get value() {
    const value = this.state.value
    return this.props.value ?? (value || this.props.defaultValue || value)
  }

  get valueScalar() {
    return this.value / this.max
  }

  get valuePercent(): number {
    return this.value / this.max * 100
  }

  get thinness() {
    const thin = this.props.thinness || 2
    return thin + this.state.thinness
  }

  changeValue(value: number) {
    value = Math.round(value * this.max)

    if (value > this.max || value < this.min) {
      return
    }

    if (value === this.value) {
      return
    }

    if (this.props.value) {
      this.props.onChange?.(value)
    }
    else {
      this.setState({value})
      this.props.onChange?.(value)
    }
  }

  calcSliderPos(event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) {
    if (!this.isDown || this.ref.current === null) return
    const {width, left} = this.ref.current.getBoundingClientRect()
    let value: number

    if ('clientX' in event) {
      let x = event.clientX
      value = (x - left) / width
    }
    else {
      let x = (event.touches[0].clientX - this.lastTouch) / .3
      value = x / width + this.lastValue
    }

    this.changeValue(value)
  }

  onMouseMove = (event: MouseEvent | TouchEvent) => {
    this.calcSliderPos(event)
  }
  onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && this.ref.current) {
      this.lastValue = this.valueScalar
      this.lastTouch = e.touches[0].clientX
    }
    this.isDown = true
    this.calcSliderPos(e)
  }
  onWheel = (event: React.WheelEvent) => {
    this.changeValue((this.value + event.deltaY > 0 ? 1 : -1) / this.max)
  }
  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('touchend', this.onMouseUp)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('touchmove', this.onMouseMove)
  }

  get style(): React.CSSProperties {
    return {
      width: `${this.valuePercent}%`,
      height: `${this.thinness}px`,
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('touchend', this.onMouseUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('touchmove', this.onMouseMove)
  }

  render() {
    return (
      <div className={clsx(styles.range, this.props.className, {[styles.show]: this.isDown})}
           onWheel={this.onWheel}
      >
        <div className={styles.text}>{this.props.text}</div>
        <div
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onMouseDown}
          ref={this.ref} className={styles.sliderContainer}>
          <div style={this.style} className={styles.slider}>
            <div className={styles.circle}></div>
            <div className={clsx(styles.info)}>{this.value}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ZenRange

import React from 'react'
import styles from './DropFile.module.scss'
import clsx from 'clsx'
import MatIcon from '../MatIcon/MatIcon'
import {MatIconCode} from '../MatIcon/MatIconCode'
import {ExternalFile, filesLoader} from '@Libs/Files/Files'

export type DropFileProps = {
  onDropFiles?: (files: ExternalFile[]) => void
}
export type DropFileState = {
  isDrag: boolean
  image: string
}


class DropFile extends React.Component<DropFileProps, DropFileState> {
  constructor(props: DropFileProps) {
    super(props)
    this.state = { isDrag: false, image: '' }

    this.drop = this.drop.bind(this)
    this.dragOver = this.dragOver.bind(this)
    this.dragEnter = this.dragEnter.bind(this)
    this.dragLeave = this.dragLeave.bind(this)
    this.paste = this.paste.bind(this)
  }

  async paste(e: ClipboardEvent) {
    const items = e.clipboardData?.files

    if (items === undefined) {
      return
    }

    this.props.onDropFiles?.(await filesLoader(items))
  }

  async drop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.dragLeave()
    const items = event.dataTransfer?.files

    if (items === undefined) {
      return
    }

    this.props.onDropFiles?.(await filesLoader(items))
  }

  dragEnter() {
    this.setState({
      isDrag: true,
    })
  }

  dragLeave() {
    this.setState({
      isDrag: false,
    })
  }

  dragOver(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  componentDidMount() {
    window.addEventListener('drop', this.drop)
    window.addEventListener('dragover', this.dragOver)

    window.addEventListener('dragenter', this.dragEnter)
    document.addEventListener('paste', this.paste)
  }

  componentWillUnmount() {
    window.removeEventListener('drop', this.drop)
    window.removeEventListener('dragover', this.dragOver)

    window.removeEventListener('dragenter', this.dragEnter)
    document.removeEventListener('paste', this.paste)
  }

  render() {
    const { isDrag } = this.state
    const classes: Record<string, boolean> = {}
    classes[styles.hover] = isDrag

    return (
      <div
        className={clsx(styles.dropFile, classes)}
        onDragLeave={this.dragLeave}
        onClick={this.dragLeave}
      >
        <div
          className={clsx(styles.border, 'animate__animated', {
            animate__bounce: isDrag,
          })}
        >
          <MatIcon icon={MatIconCode.fileOpen} className={styles.icon} />
        </div>
      </div>
    )
  }
}

export default DropFile
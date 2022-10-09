import React, {createRef} from 'react'
import styles from './ContextMenu.module.scss'
import clsx from 'clsx'
import MatIcon from '../MatIcon/MatIcon'
import {observer} from 'mobx-react'
import {contextMenuStore} from '../../store/ContextMenuStore'
import {Vector2} from '../../libs/Math/Vector2'

export type ContextMenuProps = {}
export type ContextMenuState = {}

@observer
class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
  root: React.RefObject<HTMLDivElement>

  constructor(props: ContextMenuProps) {
    super(props)
    this.root = createRef()
    this.onMouseDown = this.onMouseDown.bind(this)
  }

  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (contextMenuStore.isActive && event.button === 2) {
      contextMenuStore.setPos(Vector2.create(event.clientX, event.clientY))
    }

    if (event.button !== 0) return

    contextMenuStore.setActive(this.root.current?.contains(target) || false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown)
  }

  render() {
    const {actions, isActive} = contextMenuStore

    return (
      <div className={clsx(styles.contextMenu, {[styles.show]: isActive})}
           style={{
             left: contextMenuStore.pos.x,
             top: contextMenuStore.pos.y
           }}
           ref={this.root}>
        {
          actions
            .filter(item => item?.poll() || true)
            .map(item =>
              <div key={item.label}
                   className={styles.contextMenuItem}
                   onClick={() => {
                     item.execute()
                   }}>
                <MatIcon icon={item.icon} className={styles.icon}/>
                {item.label}
              </div>
            )
        }
      </div>
    )
  }
}

export default ContextMenu

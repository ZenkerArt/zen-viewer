import React, {createRef, useState} from 'react'
import styles from './ContextMenu.module.scss'
import clsx from 'clsx'
import MatIcon from '../MatIcon/MatIcon'
import {observer} from 'mobx-react'
import {contextMenuStore} from '@StoreIndex'
import {Vector2} from '@Libs/Math'
import {windowDragHandler} from '@Libs/WindowDragHandler'
import {ContextMenuAction} from '@Store/ContextMenuStore'
import ZenRadioButton from '@Components/ZenRadioButton/ZenRadioButton'

export type ContextMenuProps = {}
export type ContextMenuState = {}

function Item({context}: {context: ContextMenuAction}) {
  const [active, setActive] = useState(context.isActive)

  context.onChangeState = setActive
  return <div key={context.label}
              className={styles.contextMenuItem}
              onClick={() => {
                context.execute()
              }}>
    <MatIcon icon={context.icon} className={styles.icon}/>
    {context.label}
    {context.showState ? <div className={styles.left}>
      <ZenRadioButton active={active} />
    </div> : ''}
  </div>
}

@observer
class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
  root: React.RefObject<HTMLDivElement>

  constructor(props: ContextMenuProps) {
    super(props)
    this.root = createRef()
    this.onMouseUp = this.onMouseUp.bind(this)
  }

  onMouseUp(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (windowDragHandler.isStart) {
      return
    }

    if (event.button === 2) {
      contextMenuStore.setPos(Vector2.create(event.clientX, event.clientY))
      contextMenuStore.setActive(true)
    } else {
      contextMenuStore.setActive(this.root.current?.contains(target) || false)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp)
  }

  get actions() {
    return [
      ...contextMenuStore.actions,
      ...contextMenuStore.globalActions
    ]
  }

  render() {
    const {isActive} = contextMenuStore
    const actions = this.actions

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
            .map((item, index) => <Item context={item} key={index}/>)
        }
      </div>
    )
  }
}

export default ContextMenu

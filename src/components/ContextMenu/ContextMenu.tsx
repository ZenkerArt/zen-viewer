import React, {createRef} from 'react'
import styles from './ContextMenu.module.scss'
import clsx from 'clsx'
import MatIcon from '../MatIcon/MatIcon'
import {observer} from 'mobx-react'
import {contextMenuStore} from '../../store/ContextMenuStore'

export type ContextMenuProps = {}
export type ContextMenuState = {}

@observer
class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
  ref: React.Ref<HTMLDivElement>

  constructor(props: ContextMenuProps) {
    super(props)
    this.ref = createRef()
  }

  render() {
    const {actions} = contextMenuStore;

    return (
      <div className={clsx(styles.contextMenu, styles.show)}
           ref={this.ref}>
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

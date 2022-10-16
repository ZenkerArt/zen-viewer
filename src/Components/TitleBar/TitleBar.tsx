import React from 'react'
import styles from './TitleBar.module.scss'
import clsx from 'clsx'

export type TitleBarProps = {
}

function TitleBar() {
  return (
    <div className={clsx(styles.titleBar)}>
    </div>
  )
}

export default TitleBar

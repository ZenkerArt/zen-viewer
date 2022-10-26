import React from 'react'
import styles from './ZenRadioButton.module.scss'
import clsx from 'clsx'

export type ZenRadioButtonProps = {
  active: boolean
}

function ZenRadioButton(props: ZenRadioButtonProps) {
  return (
    <div className={clsx(styles.zenRadioButton, {[styles.active]: props.active})}>
    </div>
  )
}

export default ZenRadioButton

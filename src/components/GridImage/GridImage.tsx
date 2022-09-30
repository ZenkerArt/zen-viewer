import React from 'react'
import styles from './GridImage.module.scss'
import clsx from 'clsx'

export type GridImageProps = {
  src: string
}

function GridImage(props: GridImageProps) {
  const {src} = props

  return (
    <div className={clsx(styles.gridImage)}>
      <div className={styles.content}>
        <img alt="" key={src} src={src} className="animate__pulse animate__animated"/>
      </div>
    </div>
  )
}

export default GridImage

import React, {ReactNode} from 'react'
import styles from './Grid.module.scss'
import clsx from 'clsx'

export type GridProps = {
  children: ReactNode[]
  colCount?: number
}

function Grid(props: GridProps) {
  const colCount = props.colCount || 4
  const grid: ReactNode[][] = Array(colCount).fill(undefined).map(() => [])
  let rowCounter = 0

  props.children.forEach((item, index) => {
    if (index % colCount === 0) {
      rowCounter = 0
    }

    grid[rowCounter].push(item)

    rowCounter += 1
  })

  console.log(grid)
  return (
    <div className={clsx(styles.grid)}>
      {grid.map((col, index) =>
        <div style={{width: `${100 / colCount}%`}} key={index} className={styles.row}>
          {col}
        </div>
      )}
    </div>
  )
}

export default Grid

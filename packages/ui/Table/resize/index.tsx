import React, { FC, useEffect, useState } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { ColumnOption } from '../table'
import './index.scss'
import { useDrag } from '@use-gesture/react'
import classNames from 'classnames'

export interface IResizeProps {
  columnOptions: ColumnOption<any>[]
  onColumnResize?: (
    columnsWidth: number[],
    colIndex: number,
    last: boolean,
  ) => void
  onSelectColumn?: (colIndex: number) => void
  showEdit?: boolean
  height?: number
  hoverInsertBarIndex?: number
  offsetX: number
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-super-table-resize'
/** 列默认最小宽度 */
const DEFAULT_MIN_WIDTH = 60

const formatLeft = (columnOptions: ColumnOption<any>[]) => {
  let beforeLeft = 0
  return columnOptions.map<Required<ColumnOption<any>> & { left: number }>(
    (item) => {
      beforeLeft += item._width as number
      return { ...item, left: beforeLeft } as Required<ColumnOption<any>> & {
        left: number
      }
    },
  )
}

const Resize: FC<IResizeProps> = ({
  columnOptions,
  onColumnResize,
  height,
  offsetX = 0,
  hoverInsertBarIndex,
}) => {
  const [formatColumnOptions, setFormatColumnOptions] = useState<
    Required<ColumnOption<any> & { left: number }>[]
  >(formatLeft(columnOptions))

  useEffect(() => {
    const newFormatColumnOptions = formatLeft(columnOptions)
    setFormatColumnOptions(newFormatColumnOptions)

    colSizesApi.start((i) => ({ left: newFormatColumnOptions[i]?.left || 0 }))
  }, [columnOptions])

  const [colSizes, colSizesApi] = useSprings(
    formatColumnOptions.length,
    (i) => ({
      left: formatColumnOptions[i].left,
    }),
  )

  const resizeColBind = useDrag(
    ({ movement: [mx], args: [colIndex], active, event, last }) => {
      event.stopPropagation()
      const minWidth =
        formatColumnOptions[colIndex].minWidth || DEFAULT_MIN_WIDTH

      // 限制最小宽度
      if (formatColumnOptions[colIndex]._width + mx <= minWidth) {
        mx = minWidth - formatColumnOptions[colIndex]._width
      }

      if (onColumnResize)
        onColumnResize(
          formatColumnOptions.map((columnItem, i) => {
            const width = columnItem.width || columnItem._width
            if (colIndex === i) return width + mx
            return width
          }),
          colIndex,
          last,
        )

      if (!active) {
        formatColumnOptions[colIndex]._width += mx
        // 限制最小宽度
        if (formatColumnOptions[colIndex]._width <= minWidth)
          formatColumnOptions[colIndex]._width = minWidth

        const newFormatColumnOptions = formatLeft([...formatColumnOptions])
        setFormatColumnOptions(newFormatColumnOptions)

        colSizesApi.start((i) => ({ left: newFormatColumnOptions[i].left }))
        return
      }

      colSizesApi.start((i) => {
        // 移动当前列和后面的列
        if (i >= colIndex && active) {
          return { left: formatColumnOptions[i].left + mx }
        } else {
          return { left: formatColumnOptions[i].left }
        }
      })
    },
  )

  return (
    // 控制超出隐藏
    <div className={preCls}>
      {/* 控制偏移 */}
      <div
        className={`${preCls}__content`}
        style={{ transform: `translate3d(-${offsetX}px, 0, 0)` }}
      >
        {colSizes.map(({ left }, i) => (
          <animated.div
            key={i}
            className={classNames(`${preCls}__resize-bar`, {
              [`${preCls}__resize-bar--active`]: hoverInsertBarIndex === i,
            })}
            style={{ left }}
            {...resizeColBind(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default React.memo(Resize)

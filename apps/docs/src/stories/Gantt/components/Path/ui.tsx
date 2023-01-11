import React, { FC } from 'react'
import classNames from 'classnames'
import './index.scss'
import { useState } from 'react'

export interface IGanttPathProps {
  x1: number
  x2: number
  y1: number
  y2: number
  disable?: boolean
  onRemoveLink?: () => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-path'

const GanttPath: FC<IGanttPathProps> = ({
  x1,
  y1,
  x2,
  y2,
  disable,
  onRemoveLink,
  className,
  style,
}) => {
  const _x1 = Math.abs(x2) / 2
  const _y1 = 0
  const _x2 = Math.abs(x2) / 2
  const _y2 = y2
  const r = 6
  const [hoverClose, setHoverClose] = useState(false)
  const [hoverLine, setHoverLine] = useState(false)

  return (
    <>
      <path
        onMouseOver={() => setHoverLine(true)}
        onMouseOut={() => setHoverLine(false)}
        className={`${preCls}__hover`}
        d={`M ${x1} ${y1} C ${_x1} ${_y1} ${_x2} ${_y2} ${x2} ${y2}`}
      />
      <path
        fill='none'
        stroke={hoverClose ? '#e65757' : '#868686'}
        className={classNames(preCls, className)}
        style={style}
        d={`M ${x1} ${y1} C ${_x1} ${_y1} ${_x2} ${_y2} ${x2} ${y2}`}
      />
      {!disable && (
        <g className={classNames(`${preCls}__close`, {
          [`${preCls}__close--show`]: hoverLine
        })} onClick={onRemoveLink} onMouseOver={() => setHoverClose(true)} onMouseOut={() => setHoverClose(false)}>
          <circle cx={x2 / 2} cy={y2 / 2} r={r} fill="#FF8080" />
          <path stroke="#fff" fill="none" d={`M${x2 / 2 - 3},${y2 / 2 + 3} L${x2 / 2 + 3},${y2 / 2 - 3}`} />
          <path stroke="#fff" fill="none" d={`M${x2 / 2 - 3},${y2 / 2 - 3} L${x2 / 2 + 3},${y2 / 2 + 3}`} />
        </g>
      )}
    </>
  )
}

export default React.memo(GanttPath)

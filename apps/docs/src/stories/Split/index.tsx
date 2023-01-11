import React, { FC, MutableRefObject } from 'react'
import classNames from 'classnames'
import { useSprings, animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useRef } from 'react'
import { useSize } from 'ahooks'
import { useEffect } from 'react'
import './index.scss'
import { useState } from 'react'

export interface ISplitProps {
  proportions?: number[]
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-split'

export const Split: FC<ISplitProps> = ({ children, proportions, className, style }) => {
  const childrens = Array.isArray(children) ? children : [children]

  const [_proportions, setProportions] = useState(proportions || [])
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>
  const containerSize = useSize(containerRef) || { width: 0, height: 0 }
  const containerWidth = containerSize.width

  useEffect(() => {
    if (proportions) setProportions(proportions)
  }, [proportions])

  const [widths, setWidths] = useState<number[]>([])

  const [colSizes, colSizesApi] = useSprings<{
    width: number
  }>(
    childrens.length,
    (i) => ({
      width: _proportions[i] * containerWidth,
    }),
  )

  useEffect(() => {
    setWidths(_proportions.map((proportion) => proportion * containerWidth))
    colSizesApi.start(i => ({ width: _proportions[i] * containerWidth }))
  }, [containerWidth, proportions])

  const dragBind = useDrag(({ movement: [mx], args: [idx], last }) => {
    const mxProportion = mx / containerWidth
    const moveWidth = mxProportion * containerWidth
    colSizesApi.start((i) => {
      if (i === idx) {
        return { width: widths[i] + moveWidth }
      }
      if (i === idx + 1) {
        return { width: widths[i] - moveWidth }
      }
      return { width: widths[i] }
    })
    if (last) {
      widths[idx] += moveWidth
      widths[idx = 1] -= moveWidth
      setWidths([...widths])
    }
  })

  return (
    <div ref={containerRef} className={classNames(preCls, className)} style={style}>
      {childrens.map((child, i) => (
        <animated.div className={`${preCls}__item-container`} style={{ width: colSizes[i].width }}>{child}</animated.div>
      ))}
      {/* resize */}
      <div className={`${preCls}__drag-container`}>
        {childrens.map((_, i) => (
          <animated.div className={`${preCls}__drag-item`} style={{ width: colSizes[i].width }}>
            <div {...dragBind(i)} className={`${preCls}__drag-line`}></div>
          </animated.div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Split)
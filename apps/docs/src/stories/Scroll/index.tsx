import React, { FC, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import classNames from 'classnames'
import $ from 'jquery'
import { useSize } from 'ahooks'
import { MutationObserver } from '@/stories/MutationObserver'
import { useTouch } from '@/hooks/useTouch'
import useAutoRecoverState from '@/hooks/useAutoRecoverState'
import './index.scss'

export interface IScrollProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  scrollTop?: number
  scrollTopPercentage?: number
  childId?: string
  children?: React.ReactNode
  // 偏移量
  offsetTop?: number
  overflowY?: React.CSSProperties['overflowY']
  overflowX?: React.CSSProperties['overflowX']
  className?: string
  style?: React.CSSProperties
  containerClassName?: string
  containerStyle?: React.CSSProperties
}

const preCls = 'titaui-scroll'

const Scroll: React.ForwardRefExoticComponent<IScrollProps & React.RefAttributes<HTMLDivElement>> = forwardRef(({
  className,
  containerClassName,
  style,
  containerStyle,
  children,
  childId,
  offsetTop = 0,
  overflowY = 'auto',
  overflowX,
  onScroll,
  ...otherProps
}, ref) => {
  const scrollContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useImperativeHandle(ref, () => scrollContainerRef.current)

  const [scrollSize, setScrollSize] = useState({ height: 0, width: 0 })
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 })
  const scrollContainerRefSize = useSize(scrollContainerRef)

  const [down, setDown] = useState<boolean | 'col' | 'row'>(false)
  const [scrolling, setScrolling] = useAutoRecoverState(false)
  const colTouchStartTop = useRef(-1)
  const rowTouchStartLeft = useRef(-1)

  const containerHeight = (scrollContainerRefSize && scrollContainerRefSize.height - 0) || 0
  const containerWidth = (scrollContainerRefSize && scrollContainerRefSize.width - 0) || 0
  
  const colBarSize = containerHeight && (containerHeight / scrollSize.height) * 100
  const rowBarSize = containerWidth && (containerWidth / scrollSize.width) * 100

  const maxTop = containerHeight - containerHeight * (colBarSize / 100)
  const maxLeft = containerWidth - containerWidth * (rowBarSize / 100)

  const touchColBind = useTouch(({ movement, first, down }) => {
    const my = movement[1]

    setDown(down && 'col')
    if (first) colTouchStartTop.current = scrollPosition.top * containerHeight

    let newTop = colTouchStartTop.current + my
    if (newTop >= maxTop) newTop = maxTop
    if (newTop <= 0) newTop = 0

    setScrollPosition({ ...scrollPosition, top: newTop / containerHeight })
    scrollContainerRef.current.scrollTop = (newTop / containerHeight) * scrollSize.height
  })

  const touchRowBind = useTouch(({ movement, first, down }) => {
    const mx = movement[0]

    setDown(down && 'row')
    if (first) rowTouchStartLeft.current = scrollPosition.left * containerWidth

    let newLeft = rowTouchStartLeft.current + mx
    if (newLeft >= maxLeft) newLeft = maxLeft
    if (newLeft <= 0) newLeft = 0

    setScrollPosition({ ...scrollPosition, left: newLeft / containerWidth })
    scrollContainerRef.current.scrollLeft =
      (newLeft / containerWidth) * scrollSize.width
  })

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, scrollWidth } = scrollContainerRef.current
      setScrollSize({ width: scrollWidth - 0, height: scrollHeight - 0 })
    }
  }, [scrollContainerRef.current?.scrollHeight, scrollContainerRef.current?.scrollWidth])

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, scrollWidth } = scrollContainerRef.current
      setScrollSize({ width: scrollWidth - 0, height: scrollHeight - 0 })
    }
  }, [scrollContainerRef])

  // 滚动到指定的子元素位置
  useEffect(() => {
    if (childId !== undefined) {
      const containerDom = $(scrollContainerRef.current)
      // @ts-ignore
      const child: HTMLDivElement = containerDom.find(`#${childId}`)[0]
      if (!child) return

      // 如果没有滚动条则不滚动
      const { offsetHeight, scrollHeight } = scrollContainerRef.current
      if (scrollHeight <= offsetHeight) return

      containerDom.animate({ scrollTop: child.offsetTop - offsetTop })
    }
  }, [childId])

  const onScrollHandler: React.UIEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (onScroll) onScroll(e)

      setScrolling(true)
      if (down) return

      const { scrollTop, scrollLeft } = e.target as unknown as {
        scrollTop: number
        scrollLeft: number
      }

      setScrollPosition({
        top: scrollTop / scrollSize.height,
        left: scrollLeft / scrollSize.width,
      })
    },
    [scrollSize, containerHeight, containerWidth, down]
  )

  return (
    <div
      className={classNames(preCls, containerClassName)}
      style={containerStyle}
      {...otherProps}
    >
      <div className={classNames(`${preCls}__wrapper`)}>
        <div className={classNames(`${preCls}__mask`)}>
          <div
            ref={scrollContainerRef}
            className={classNames(`${preCls}__scroll`, className)}
            style={{ overflowY, overflowX, ...style }}
            onScroll={onScrollHandler}
          >
            {children}
          </div>
        </div>
        <div className={`${preCls}__placeholder`} style={{ width: 'auto', height: scrollContainerRefSize?.height }} />
      </div>
      {colBarSize < 100 && (
        <div className={`${preCls}__col_bar_container`}>
          <div
            {...touchColBind}
            className={classNames(`${preCls}__col_bar`, {
              [`${preCls}__col_bar--show`]: down === 'col' || scrolling,
            })}
            style={{
              height: `${colBarSize}%`,
              top: `${scrollPosition.top * 100}%`,
            }}
          ></div>
        </div>
      )}
      {rowBarSize < 100 && (
        <div className={`${preCls}__row_bar_container`}>
          <div
            {...touchRowBind}
            className={classNames(`${preCls}__row_bar`, {
              [`${preCls}__row_bar--show`]: down === 'row' || scrolling,
            })}
            style={{
              width: `${rowBarSize}%`,
              left: `${scrollPosition.left * 100}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  )
})

export default React.memo(Scroll)

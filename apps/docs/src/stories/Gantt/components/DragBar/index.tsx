import React, { FC, useContext } from 'react'
import classNames from 'classnames'
import { GanttContext, GanttContextValue } from '../../context'
import { TaskKey } from '../../types'
import './index.scss'

export interface GanttIDragLinkProps {
  value: TaskKey
  disable?: boolean
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-drag-link'

const GanttDragLink: FC<GanttIDragLinkProps> = ({ value, disable, className, style, children }) => {
  const { downLink, setDownLink, linkContextRef, onCreateLink } = useContext(GanttContext) as Required<GanttContextValue>
  const onMouseDownLeftHandler = () => {
    linkContextRef.current.currentKey = value
    linkContextRef.current.currentLinkType = 'left'
    setDownLink(true)
  }
  const onMouseDownRightHandler = () => {
    linkContextRef.current.currentKey = value
    linkContextRef.current.currentLinkType = 'right'
    setDownLink(true)
  }
  const onMouseOverHandler = () => {
    // 移动到自身
    if (downLink && linkContextRef.current.currentKey === value) {
      setDownLink(false)
      return
    }
    if (!downLink || linkContextRef.current.currentKey === value) return
    linkContextRef.current.targetKey = value

    const { currentLinkType, currentKey, targetKey } = linkContextRef.current
    if (!currentKey || !targetKey) return

    switch (currentLinkType) {
      case 'left':
        onCreateLink(targetKey, currentKey)
        return
      case 'right':
        onCreateLink(currentKey, targetKey)
        return
    }

    setDownLink(false)
  }
  const onMouseOutHandler = () => {
    if (!downLink || linkContextRef.current.currentKey === value) return
    // @ts-ignore
    linkContextRef.current.targetKey = undefined
  }
  if (disable) return <>{children}</>
  return (
    <div className={classNames(preCls, className)} style={style} onMouseOver={onMouseOverHandler} onMouseOut={onMouseOutHandler}>
      <div className={`${preCls}__left-bar`} onMouseDown={onMouseDownLeftHandler}></div>
      {children}
      <div className={`${preCls}__right-bar`} onMouseDown={onMouseDownRightHandler}></div>
    </div>
  )
}

export default React.memo(GanttDragLink)

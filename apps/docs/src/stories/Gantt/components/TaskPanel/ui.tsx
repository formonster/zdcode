import React, { FC, MutableRefObject, useRef, useState } from 'react'
import classNames from 'classnames'
import { useDrag } from '@use-gesture/react'
import './index.scss'
import { useEffect } from 'react'
import { useSize } from 'ahooks'

export interface IGanttTaskPanelProps {
  progress?: number
  width: number
  unitWidth: number
  theme: string
  disable?: boolean
  onChangeProgress?: (progress: number) => void
  onChangeWidth?: (mx: number, type: 'left' | 'right') => void
  onMoveLeft: (mx: number, last: boolean) => void
  onMoveRight: (mx: number, last: boolean) => void
  content: React.ReactNode
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-task-panel'

const GanttTaskPanel: FC<IGanttTaskPanelProps> = ({ theme, disable, content, progress = 0, width, unitWidth, onChangeProgress, onChangeWidth, onMoveLeft, onMoveRight, className, style }) => {
  const [_progress, setProgress] = useState(progress)
  const [dragWidth, setDragWidth] = useState(false)
  const [down, setDown] = useState(false)
  const [_width, setWidth] = useState(width)
  const [disableMini, setDisableMini] = useState(false)

  const panelRef = useRef() as MutableRefObject<HTMLDivElement>
  const { width: panelWidth } = useSize(panelRef) || { width: 0 }

  useEffect(() => {
    setWidth(width)
  }, [width])

  useEffect(() => {
    setProgress(progress)
  }, [progress])

  const dragEndTimeRef = useRef<number>()

  const onMouseOverHandler = () => {
    const nowDate = Date.now()
    if (dragEndTimeRef.current && nowDate - dragEndTimeRef.current < 200) {
      setDisableMini(true)
    }
  }

  const dragLeftBind = useDrag(({ movement: [mx], event, active, last }) => {
    event.stopPropagation()
    setDragWidth(active)

    if (last && mx > -unitWidth / 2 && mx < unitWidth / 2) {
      setWidth(width)
      return
    }

    const newWidth = width - mx
    setWidth(newWidth)
    onMoveLeft(mx, last)

    if (last && onChangeWidth) {
      dragEndTimeRef.current = Date.now()
      onChangeWidth(mx, 'left')
    }
  })

  const dragRightBind = useDrag(({ movement: [mx], event, active, last }) => {
    event.stopPropagation()
    setDragWidth(active)

    if (last && mx < unitWidth / 2 && mx > -unitWidth / 2) {
      setWidth(width)
      return
    }

    const newWidth = width + mx
    setWidth(newWidth)
    if (onMoveRight) onMoveRight(mx, last)

    if (last && onChangeWidth) {
      dragEndTimeRef.current = Date.now()
      onChangeWidth(mx, 'right')
    }
  })

  const dragBind = useDrag(({ movement: [mx], event, active, last }) => {
    event.stopPropagation()
    setDown(active)

    let newProgress = Math.floor(progress + mx / panelWidth * 100)
    if (newProgress >= 100) newProgress = 100
    setProgress(newProgress)

    if (last && onChangeProgress) onChangeProgress(_progress)
  })

  const isMini = _width <= 40
  
  return (
    <div ref={panelRef} className={classNames(preCls, className, {
      [`${preCls}--isMini`]: isMini && !dragWidth && !disableMini,
      [`${preCls}--disable`]: disable
    })} style={{ ...style, width: _width, backgroundColor: theme }} onMouseOver={onMouseOverHandler} onMouseOut={() => setDisableMini(false)}>
      <div className={`${preCls}__over-hidden`}>
        {!disable && <div className={`${preCls}__left-bar`} {...dragLeftBind()}></div>}
        <div className={`${preCls}__content`}>
          {content}
        </div>
        <div className={`${preCls}__progress`} style={{ width: `${_progress}%` }}></div>
        {!disable && <div className={`${preCls}__right-bar`} {...dragRightBind()}></div>}
      </div>
      {!disable && (
        <div className={`${preCls}__progress-bar`} style={{ left: `${_progress}%` }} {...dragBind()}>
          <div className={`${preCls}__progress-bar__triangle`}></div>
          {down && <p className={`${preCls}__progress-bar__bar-num`}>{_progress}%</p>}
        </div>
      )}
    </div>
  )
}

export default React.memo(GanttTaskPanel)

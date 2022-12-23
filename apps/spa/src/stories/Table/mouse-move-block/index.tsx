import React, { FC, useRef } from 'react'
import classNames from 'classnames'
import './index.scss'

interface ItemOption {
  key: string
  width: number | string
}

// @ts-ignore
export interface IMouseMoveBlockProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  items: ItemOption[]
  onChange: (key: string | undefined) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-mouse-move-block'

const MouseMoveBlock: FC<IMouseMoveBlockProps> = ({ items, className, style, children, onChange, ...otherProps }) => {
  const currentOverKey = useRef()
  const onMouseOverHandler = (key) => {
    currentOverKey.current = key
    onChange(key)
  }
  const onMouseOutCaptureHandler = (key) => {
    if (currentOverKey.current === key) currentOverKey.current = undefined
    setTimeout(() => {
      if (currentOverKey.current !== undefined) return
      onChange(undefined)
    }, 100)
  }
  return (
    <div className={classNames(preCls, className)} {...otherProps}>
      <div className={`${preCls}__blocks`}>
        {items.map(({ key, width }) => (
          <div className={`${preCls}__block-item`} key={key} style={{ width }} onMouseOver={() => onMouseOverHandler(key)} onMouseOutCapture={() => onMouseOutCaptureHandler(key)}></div>
        ))}
      </div>
      {children}
    </div>
  )
}

export default React.memo(MouseMoveBlock)

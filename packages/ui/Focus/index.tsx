import React, { FC, useRef, useEffect } from 'react'
import './index.scss'

// @ts-ignore
export interface IFocusProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onFocus?: (state: true) => void
  onBlur?: (state: false) => void
  /** 排除指定的类名，当命中指定的类名时，不会触发失焦事件 */
  excludeClassName?: string[]
  children?: React.ReactNode
}

export const Focus: FC<IFocusProps> = React.memo(({ children, onFocus, onBlur, excludeClassName, ...divProps }) => {
  const isFocusRef = useRef(false)
  const focusRef = useRef<any>()
  const downRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const focusDom: HTMLDivElement = focusRef.current
    function mouseupHandler(this: HTMLElement, ev: MouseEvent) {
      // 禁止在拖拽时触发
      if (Math.abs(ev.clientX - downRef.current.x) > 10) return
      if (Math.abs(ev.clientY - downRef.current.y) > 10) return
      
      // @ts-ignore
      let parentNode: HTMLElement = ev.target.parentNode
      while (parentNode !== window.document.body) {
        if (parentNode === focusDom) {
          if (onFocus && !isFocusRef.current) onFocus(true)
          isFocusRef.current=true
          return
        }
        // 排除指定的类名
        if (excludeClassName && parentNode.className.split(' ').find((className) => excludeClassName.includes(className))) {
          if (onFocus && !isFocusRef.current) onFocus(true)
          isFocusRef.current=true
          return
        }
        parentNode = parentNode.parentNode as HTMLElement
      }
      if (onBlur && isFocusRef.current) {
        onBlur(false)
      }
      isFocusRef.current=false
    }
    function mouseDownHandler(e) {
      downRef.current = { x: e.clientX, y: e.clientY }
    }
    window.document.body.addEventListener('mouseup', mouseupHandler, true)
    window.document.body.addEventListener('mousedown', mouseDownHandler, true)
    return () => {
      window.document.body.removeEventListener('mouseup', mouseupHandler)
      window.document.body.removeEventListener('mousedown', mouseDownHandler)
    }
  }, [])
  return (
    <div ref={focusRef} {...divProps}>
      {children}
    </div>
  )
})

export default Focus
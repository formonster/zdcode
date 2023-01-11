import React, { FC, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

// @ts-ignore
export interface IMutationObserverProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onMutationObserver?: (state: true) => void
  children?: React.ReactNode
}

export const MutationObserver: React.ForwardRefExoticComponent<IMutationObserverProps & React.RefAttributes<HTMLDivElement>> = React.memo(forwardRef(({
  children,
  onMutationObserver,
  ...divProps
}, ref) => {
  const mutationObserverRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useImperativeHandle(ref, () => mutationObserverRef.current)

  useEffect(() => {
    var target = mutationObserverRef.current
    if (!target) return

    var MutationObserver =
      window.MutationObserver ||
      // @ts-ignore
      window.WebKitMutationObserver ||
      // @ts-ignore
      window.MozMutationObserver
    // 选择目标节点
    // 创建观察者对象
    var observer = new ResizeObserver(function (entries) {
      for (const entry of entries) {
        // if (entry.contentBoxSize) {
        //   // Firefox implements `contentBoxSize` as a single content rect, rather than an array
        //   const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
    
        //   h1Elem.style.fontSize = `${Math.max(1.5, contentBoxSize.inlineSize / 200)}rem`;
        //   pElem.style.fontSize = `${Math.max(1, contentBoxSize.inlineSize / 600)}rem`;
        // } else {
        //   h1Elem.style.fontSize = `${Math.max(1.5, entry.contentRect.width / 200)}rem`;
        //   pElem.style.fontSize = `${Math.max(1, entry.contentRect.width / 600)}rem`;
        // }
      }
    })
    
    // 配置观察选项:
    var config = {
      attributes: true, //检测属性变动
      childList: true, //检测子节点变动
      characterData: true, //节点内容或节点文本的变动。
      attributeFilter: ['style'],
    }
    const mobserver = new MutationObserver(function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for(let mutation of mutationsList) {
          if (mutation.type === 'childList') {
              console.log('A child node has been added or removed.');
          }
          else if (mutation.type === 'attributes') {
              console.log('The ' + mutation.attributeName + ' attribute was modified.');
          }
      }
    });
    mobserver.observe(target, config);
    
    // 传入目标节点和观察选项
    observer.observe(target)
  }, [mutationObserverRef.current])

  return (
    <div ref={mutationObserverRef} {...divProps}>
      {children}
    </div>
  )
}))

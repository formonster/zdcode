import React, {
  Suspense,
  Component,
  lazy,
  ErrorInfo,
  ComponentType,
} from 'react'

// React 18 之后需要明确指定 children 属性
class LazyComponent extends Component<{
  children: React.ReactNode | JSX.Element
}> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 可以在这里进行上报
    console.log('异步组件加载异常！')
    console.log(error, errorInfo)
  }
  render() {
    const { children } = this.props
    return <Suspense fallback={<div></div>}>{children}</Suspense>
  }
}

const createLazyComponent = (
  child: () => Promise<{ default: ComponentType<any> }>
) => {
  const Child = lazy(child)
  return (
    <LazyComponent>
      <Child />
    </LazyComponent>
  )
}

export default createLazyComponent

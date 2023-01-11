import React, { FC } from 'react'
import Scroll, { IScrollProps } from '@/stories/Scroll'
import './base.scss'

export interface IBaseProps extends IScrollProps {
  /**
   * 内容宽度
   * @editData {"width": 2000, "height": 2000}
   * @editType json
   */
  style: React.CSSProperties
}

const preCls = 'titaui-scroll-example-base'

const Base: FC<IBaseProps> = ({ style }) => {
  return (
    <Scroll className={preCls}>
      <div className={`${preCls}__content`} style={style}></div>
    </Scroll>
  )
}

export default React.memo(Base)

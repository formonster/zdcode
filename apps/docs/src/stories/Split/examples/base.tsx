import React, { FC, useMemo } from 'react'
import Split from '../'

export interface IBaseProps {
  children?: React.ReactNode
  className?: string
  /**
   * style
   * @editType json
   * @editData {"height": "200px"}
   */
  style?: React.CSSProperties
}

const Base: FC<IBaseProps> = ({ style }) => {
  const proportions = useMemo(() => [.3, .7], [])
  return (
    <div style={style}>
      <Split proportions={proportions}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Split>
    </div>
  )
}

export default React.memo(Base)

import React, { FC } from 'react'
import Button, { IButtonProps } from '@/stories/Button'
import './base.scss'

export interface IBaseProps extends IButtonProps {
  /**
   * Is this the principal call to action on the page?11
   */
  type?: 'default' | 'primary' | 'dashed' | 'text' | 'link'
}

const Base: FC<IBaseProps> = (props) => {
  return <Button {...props}>Hello Button!</Button>
}

export default React.memo(Base)

import React from 'react'
import { Button as AntdButton, ButtonProps } from 'antd'
import { CompoundedComponent, FloatButtonGroupProps } from 'antd/es/float-button/interface'

export const Button = (props: ButtonProps) => {
  return <AntdButton {...props} />
}

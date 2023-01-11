import React, { FC,useEffect, useState } from 'react';
import classNames from 'classnames';
import {IButtonProps} from './interface'
import { preCls } from './preCls'

import "./index.scss";

const DefaultButton: FC<IButtonProps> = (props) => {
  const {
    size = 'default',
    className,
    style,
    children,
  } = props
  return (
    <button
      className={classNames(`${preCls}-default`,{
        [`${preCls}-size-${size}`]: size,
      },className)}
      style={style}
    >
      {children}
    </button>
  )
}

export default DefaultButton;
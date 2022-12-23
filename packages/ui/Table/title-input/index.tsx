import React, { FC, useState, useEffect } from 'react'
import './index.scss'

export interface ITableTitleInputProps {
  value: string
  onChangeTitle: (value: string) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-table-title-input'

const TableTitleInput: FC<ITableTitleInputProps> = ({
  value,
  onChangeTitle,
}) => {
  const [title, setTitle] = useState(value)

  useEffect(() => {
    setTitle(title)
  }, [title])

  const onChangeHandler = (e) => {
    const value = e.target.value
    if (onChangeTitle) onChangeTitle(value)
    setTitle(value)
  }

  const onBlurHandler = (e) => {
    const value = e.target.value || '自定义列'
    if (onChangeTitle) onChangeTitle(value)
    setTitle(value)
  }

  return (
    <input
      className={preCls}
      value={title}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
    />
  )
}

export default React.memo(TableTitleInput)

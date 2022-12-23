import classNames from 'classnames'
import React, { FC } from 'react'
import { animated, SpringValue } from '@react-spring/web'
import { ColumnOption } from '../table'
import get from 'lodash/get'
import './index.scss'

export interface IBoxProps<RecordType = any> {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  width: SpringValue<number>
  rowIdx: number
  record: RecordType
  columnOption: ColumnOption<RecordType>
  active?: boolean
}

const preCls = 'titaui-super-table-box'

const Box: FC<IBoxProps> = ({
  className,
  style,
  record,
  rowIdx,
  columnOption,
  active,
  width,
}) => {
  const { dataIndex, onCell, render, renderFill, hidden } = columnOption

  const spanOption = onCell ? onCell(record, rowIdx) || {} : {}
  if (spanOption.rowSpan === 0 || spanOption.colSpan === 0) return <></>

  let value = get(record, dataIndex)
  let content: React.ReactNode = <></>

  if (render) {
    const Render = render
    content = (
      <Render
        value={dataIndex ? value : undefined}
        data={record}
        rowIdx={rowIdx}
      />
    )
  }
  if (!render && dataIndex) content = value

  return (
    <td
      className={classNames(preCls, className, {
        [`${preCls}--active`]: active,
      })}
      style={style}
      {...spanOption}
    >
      <div className={classNames(`${preCls}__box-container`, {
        [`${preCls}__box-container--hidden`]: hidden
      })}>
        <animated.div style={{ width, height: '100%' }}>
          {renderFill ? (
            <div className={`${preCls}__full-content`}>{content}</div>
          ) : (
            <div className={`${preCls}__content`}>{content}</div>
          )}
        </animated.div>
      </div>
    </td>
  )
}

export default React.memo(Box)

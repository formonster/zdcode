import React, { FC, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { animated, SpringValue } from '@react-spring/web'
import classNames from 'classnames'
import MouseMoveBlock from '../mouse-move-block'
// import PopupBtn from '../../popup-btn'
import { Focus } from '../../Focus'
import { ColumnOption } from '../table'
import './index.scss'

const mouseMoveBlockItems = [
  {
    key: 'left',
    width: '50%'
  },
  {
    key: 'right',
    width: '50%'
  },
]

export interface IEditProps {
  columnOptions: ColumnOption<any>[]
  onAddColumn?: (insertIndex: number, showColumnIndex: number) => void
  onRemoveColumn?: (colIndex: number) => void
  onSelectColumn?: (colIndex: number) => void
  onHoverInsertBar: (colIndex: number) => void
  showInsert?: boolean
  showEdit?: boolean
  children?: React.ReactNode
  offsetX: number
  colWidth: {
    width: SpringValue<number>
  }[]
}

const preCls = 'titaui-super-table-edit'

const Edit: FC<IEditProps> = ({
  columnOptions,
  onAddColumn,
  onRemoveColumn,
  onSelectColumn,
  onHoverInsertBar,
  showEdit,
  showInsert,
  colWidth,
  offsetX,
}) => {
  // 选择列
  const [selectedColIndex, setSelectedColIndex] = useState<number>()
  const [showInsertBarIndex, setShowInsertBarIndex] = useState<number>()
  const popupContainerRef = useRef()

  const onSelectColumnHandler = (colIndex: number) => {
    const newColIndex = colIndex
    if (onSelectColumn) onSelectColumn(newColIndex)
    setSelectedColIndex(newColIndex)
  }

  // 禁止编辑后，重制选中状态
  useEffect(() => {
    if (
      !showEdit &&
      onSelectColumn &&
      ![-1, undefined].includes(selectedColIndex)
    ) {
      setSelectedColIndex(-1)
      onSelectColumn(-1)
    }
  }, [showEdit])

  const onBlur = () => {
    setSelectedColIndex(-1)
    if (onSelectColumn) onSelectColumn(-1)
  }

  const columnCtlData = useMemo(
    () => [
      {
        icon: 'canceled',
        value: 'remove',
      },
    ],
    [],
  )

  const onSelectActionHandler = useCallback((value: string, colIdx: number) => {
    if (value === 'remove' && onRemoveColumn) onRemoveColumn(columnOptions[colIdx].idx as number)
  }, [columnOptions])

  const hoverInsertBarRef = useRef(false)

  const onMouseMoveChange = (idx: number, key: 'left' | 'right') => {
    if (key === undefined) {
      setShowInsertBarIndex(-1)
      if (!hoverInsertBarRef.current) onHoverInsertBar(-1)
      return
    }
    const insertBarIndex = key === 'left' ? idx : idx + 1
    setShowInsertBarIndex(insertBarIndex)
    onHoverInsertBar(insertBarIndex - 1)
  }

  return (
    <div ref={popupContainerRef}>
      {showEdit && (
        <div className={`${preCls}__col-edit__item`} style={{ width: 0 }}>
          <div className={`${preCls}__insert-bar-container`} onClick={() => onAddColumn && onAddColumn(0, 0)}>
            <div className={classNames(`${preCls}__insert-bar`, {
              [`${preCls}__insert-bar--show`]: showInsertBarIndex === 0
            })}>
              <i className="tu-icon-add1" />
            </div>
          </div>
        </div>
      )}
      {showEdit && (
        <Focus
          onBlur={onBlur}
          className={`${preCls}__col-edit`}
          excludeClassName={['titaui-popup']}
        >
          <div className={`${preCls}__col-edit-line-bar`}>
            <div className={`${preCls}__col-edit__line-bar-container`} style={{ transform: `translate3d(-${offsetX}px, 0, 0)` }}>
              {colWidth.map(({ width }, i) => (
                <animated.div
                    className={`${preCls}__col-edit__item`}
                    style={{ width }}
                  >
                  {/* <PopupBtn
                    key={i}
                    menuData={columnOptions[i].canRemove ? columnCtlData : []}
                    popupPlacement="top"
                    action="click"
                    popupAlign={{
                      offset: [0, -4],
                    }}
                    getPopupContainer={() => popupContainerRef.current}
                    // 如果允许删除才展示弹层
                    visible={false}
                    onChange={(value: string) => onSelectActionHandler(value, i)}
                    autoClose={false}
                  > */}
                    <MouseMoveBlock
                      items={mouseMoveBlockItems}
                      onChange={(key) => onMouseMoveChange(i, key)}
                      onClick={() => onSelectColumnHandler(i)}
                      className={classNames(`${preCls}__click-bar`, {
                        [`${preCls}__click-bar--selected`]:
                          selectedColIndex === i,
                      })}
                    />
                  {/* </PopupBtn> */}
                </animated.div>
              ))}
            </div>
          </div>

          <div className={`${preCls}__col-edit-insert-bar`}>
            <div className={`${preCls}__col-edit-container`} style={{ transform: `translate3d(-${offsetX}px, 0, 0)` }}>
              {colWidth.map(({ width }, i) => (
                <animated.div
                  className={`${preCls}__col-edit__item`}
                  style={{ width }}
                >
                  {showInsert && (
                    <div
                      className={`${preCls}__insert-bar-container`}
                      onClick={() => onAddColumn && onAddColumn(columnOptions[i].idx as number + 1, i)}
                      onMouseOver={() => {
                        onHoverInsertBar && onHoverInsertBar(i)
                        hoverInsertBarRef.current = true
                      }}
                      onMouseOut={() => {
                        onHoverInsertBar && onHoverInsertBar(-1)
                        hoverInsertBarRef.current = false
                      }}
                    >
                      <div className={classNames(`${preCls}__insert-bar`, {
                        [`${preCls}__insert-bar--show`]: showInsertBarIndex === i + 1
                      })}>
                        <i className="tu-icon-add1" />
                      </div>
                    </div>
                  )}
                </animated.div>
              ))}
            </div>
          </div>
        </Focus>
      )}
    </div>
  )
}

export default React.memo(Edit)

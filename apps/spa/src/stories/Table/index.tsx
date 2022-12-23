import React, {
  FC,
  useCallback,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import classNames from 'classnames'
import debounce from 'lodash/debounce'
import { useSprings, animated, useSpring } from '@react-spring/web'
import Box from './box'
import Resize from './resize'
import Edit from './edit'
import './index.scss'
import { Focus } from '../Focus'
import TitleInput from './title-input'

export interface BaseColumnOption<RecordType> {
  title: string
  key?: React.Key
  width?: number
  // 内部使用的 width
  _width?: number
  idx?: number
  center?: boolean
  hidden?: boolean
  renderFill?: boolean
  isCustomColumn?: boolean
  canInsertColumn?: boolean
  canEditTitle?: boolean
  canRemove?: boolean
  isPinned?: boolean
  /** 列最小宽度（默认 60） */
  minWidth?: number
  onCell?: (
    record: RecordType,
    rowIdx: number,
  ) => { rowSpan?: number; colSpan?: number } | undefined | false
}

export type RenderHandler<
  RecordType,
  DataIndex extends keyof RecordType,
> = (params: {
  value: RecordType[DataIndex]
  data: RecordType
  rowIdx: number
}) => React.ReactElement

interface RenderColumnOption<RecordType, DataIndex extends keyof RecordType>
  extends BaseColumnOption<RecordType> {
  dataIndex?: DataIndex
  render: RenderHandler<RecordType, keyof RecordType>
}
interface DataIndexColumnOption<RecordType, DataIndex extends keyof RecordType>
  extends BaseColumnOption<RecordType> {
  dataIndex: DataIndex
  render?: RenderHandler<RecordType, DataIndex>
}

export type ColumnOption<RecordType = any> =
  | RenderColumnOption<RecordType, keyof RecordType>
  | DataIndexColumnOption<RecordType, keyof RecordType>

export type ColumnOptions<RecordType> = ColumnOption<RecordType>[]

export type TableRef = {
  focusTitle: (colIndex: number) => void
}

export interface ITableProps<RecordType> {
  /**
   * 列配置
   * @editType json
   * @editData [{"title": "姓名", "dataIndex": "name"}, {"title": "年龄", "dataIndex": "age"}]
   * @isArray
   */
  columns: ColumnOption<RecordType>[]
  /**
   * 数据源
   * @editType json
   * @editData [{"id": 0, "name": "张三", "age": 10}, {"id": 1, "name": "李四", "age": 18}]
   * @isArray
   */
  dataSource: RecordType[]
  /** 是否可以修改 */
  showEdit?: boolean
  /** 是否允许插入列，优先级低于 showEdit */
  showInsert?: boolean
  /** 固定高度 */
  height?: number
  /** 最大高度 */
  maxHeight?: number
  /** 固定列 */
  pinned?: [number, number?]
  /** 固定表头 */
  pinnedHeader?: boolean
  /**
   * key
   * @editType string
   * @default id
   */
  rowKey: string | ((record: RecordType, rowIndex: number) => string | number)
  onAddColumn?: (index: number, showColumnIndex: number) => void
  onRemoveColumn?: (colIndex: number) => void
  onColumnResize?: (colIndex: number, width: number) => void
  onChangeTitle?: (
    title: string,
    colIndex: number,
    colOption: ColumnOption<RecordType>,
  ) => void
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-super-table'

const getPinnedLeft = (
  currentIndex: number,
  columns: Required<ColumnOption>[],
) => columns.slice(0, currentIndex).reduce((pre, cur) => pre + cur._width, 0)
const getPinnedRight = (
  currentIndex: number,
  columns: Required<ColumnOption>[],
) => columns.slice(currentIndex + 1).reduce((pre, cur) => pre + cur._width, 0)

type PinnedOption = {
  isPinned: boolean
  pinnedStyle: React.CSSProperties
  pinnedIndex: [number, number]
}
const getPinnedOption = (
  columns: Required<ColumnOption<any>>[],
  currentIndex: number,
  pinned?: [number, number?],
): PinnedOption => {
  
  const columnsLength = columns.length
  if (!pinned)
    return {
      isPinned: false,
      pinnedStyle: {},
      pinnedIndex: [0, columnsLength - 1],
    }

  // 这里是计算要被固定列的边界下标
  // 比如 pinned 设置了 [1, 1]，这就代表要固定第一列和最后一列，边界下标也就是第一列和最后一列的下标
  // 左侧要被固定的最后一列的下标
  const leftIndex = pinned[0] - 1
  // 右侧要被固定的第一列的下标
  const rightIndex = columnsLength - (pinned[1] || 0)

  const result: PinnedOption = {
    isPinned: true,
    pinnedStyle: {},
    pinnedIndex: [leftIndex, rightIndex],
  }

  if (currentIndex <= leftIndex) {
    result.pinnedStyle = {
      position: 'sticky',
      zIndex: 3,
      left: getPinnedLeft(currentIndex, columns),
    }
    return result
  }
  if (currentIndex >= rightIndex) {
    result.pinnedStyle = {
      position: 'sticky',
      zIndex: 3,
      right: getPinnedRight(currentIndex, columns),
    }
    return result
  }
  return {
    isPinned: false,
    pinnedStyle: {},
    pinnedIndex: [0, columnsLength - 1],
  }
}

const fillWidth = (columns: ColumnOptions<any>, offsetWidth: number) => {
  const columnsTotalWidth = columns.reduce(
    (width, curr) => (curr.hidden ? 0 : curr.width || 0) + width,
    0,
  )

  // 剩余的宽度
  const surplusWidth = offsetWidth - columnsTotalWidth

  // 将没有设置宽度的列均分，如果均分
  // 没有设置宽度的个数
  const unWidthColumnNum = columns.filter(({ width }) => !width).length
  // 平均值
  let columnWidth = surplusWidth / unWidthColumnNum
  if (columnWidth < 118) columnWidth = 118

  return columns.map((item) => {
    let _width = columnWidth
    if (item.width) _width = item.width
    if (item.minWidth && item.minWidth > _width) _width = item.minWidth
    return { ...item, _width }
  })
}

const getFormatColumns = (
  columns: ColumnOptions<any>,
  offsetWidth: number,
  pinned?: [number, number?],
) => {
  const showColumnOptions = columns
    // 记录原始下标
    .map((columnItem, idx) => ({ ...columnItem, idx }))
    // 过滤隐藏列
    .filter((columnOption) => !columnOption.hidden)
  const fillWidthColumns = fillWidth(showColumnOptions, offsetWidth)
  
  const formatColumns = fillWidthColumns
    .map((columnOption, colIndex) => {
      const { pinnedStyle, pinnedIndex, isPinned } = getPinnedOption(
        fillWidthColumns as Required<ColumnOption<any>>[],
        colIndex,
        pinned,
      )
      return { ...columnOption, pinnedStyle, isPinned, pinnedIndex }
    })

  return formatColumns as (Required<ColumnOption<any>> & PinnedOption)[]
}

const SuperTable: React.ForwardRefExoticComponent<ITableProps<any> & React.RefAttributes<TableRef>> = forwardRef(({
  className,
  style,
  height,
  maxHeight,
  columns,
  dataSource,
  showEdit,
  showInsert = true,
  onChangeTitle,
  onAddColumn,
  onRemoveColumn,
  onColumnResize,
  pinned,
  rowKey,
  pinnedHeader,
}, ref) => {
  const scrollRef = useRef<any>()
  const headTrRef = useRef() as React.MutableRefObject<HTMLTableRowElement>
  const [scrollHeight, setScrollHeight] = useState(0)

  useImperativeHandle(ref, () => ({
    focusTitle: (allColumnIndex: number) => {
      // showIndex 是基于全列（包含隐藏列）的索引，所以需要转换成计入展示列的索引
      const selfIndex = formatColumns.findIndex((columnItem) => columnItem.idx === allColumnIndex)
      const columnTh = headTrRef.current.querySelectorAll('th')[selfIndex]
      const input = columnTh.querySelector('input')
      input?.focus()
    },
  }))

  const [formatColumns, setFormatColumns] = useState<
    (Required<ColumnOption<any>> & PinnedOption)[]
  >([])

  const resizeAnimated = (formatColumns: Required<ColumnOption>[]) => {
    colSizesApi.start((i) => ({ width: formatColumns[i]?._width || 0 }))
    tableWidthApi.start({
      width: formatColumns.reduce(
        (prevWidth, currColumn) => prevWidth + currColumn._width,
        0,
      ),
    })
  }

  useEffect(() => {
    if (scrollRef.current && scrollRef.current) {
      const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current
      
      setShowPinnedRightShadow(scrollLeft < scrollWidth - offsetWidth)

      const formatColumns = getFormatColumns(columns, offsetWidth, pinned)
      setFormatColumns(formatColumns)
      resizeAnimated(formatColumns)
    }
  }, [scrollRef, columns])

  useEffect(() => {
    // 当列配置更新后，重设 scrollHeight
    const { offsetHeight } = scrollRef.current
    setScrollHeight(offsetHeight)
    
    const onResize = debounce(function onResize() {
      const { offsetWidth } = scrollRef.current
      setTimeout(() => {
        const { offsetHeight } = scrollRef.current
        // 宽度改变后，内容高度有可能发生变化，需要重设 scrollHeight
        setScrollHeight(Math.max(offsetHeight))
      }, 500)

      const newFormatColumnOptions = fillWidth(formatColumns, offsetWidth)
      resizeAnimated(newFormatColumnOptions as Required<ColumnOption>[])
      setFormatColumns(newFormatColumnOptions as any)
    }, 200)

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [formatColumns])

  // 列宽
  const [colSizes, colSizesApi] = useSprings(formatColumns.length, (i) => ({
    width: formatColumns[i]._width as number,
  }))
  // 表格总宽
  const [tableWidth, tableWidthApi] = useSpring(() => ({
    width: formatColumns.reduce(
      (width, curr) => (curr.hidden ? 0 : (curr._width as number)) + width,
      0,
    ),
  }))
  // 当前选中列的索引
  const [selectedColIndex, setSelectedColIndex] = useState<number>()

  // 列宽变化事件
  const onColumnResizeHandler = useCallback((columnsWidth: number[], colIndex: number, last: boolean) => {
    tableWidthApi.start({
      width: columnsWidth.reduce(
        (prevWidth, currWidth) => prevWidth + currWidth,
      ),
    })
    colSizesApi.start((i) => ({ width: columnsWidth[i] }))

    if (last) {
      setFormatColumns(formatColumns.map((columnItem, i) => {
        // 如果当前列有设置宽度 | columnItem 为当前被拖动的列
        // 当列被拖动后，页面重新 resize 时，不希望它被自动分配宽度，而是使用用户拖动后的宽度
        if (columnItem.width || i === colIndex) {
          return { ...columnItem, width: columnsWidth[i], _width: columnsWidth[i] }
        }
        return { ...columnItem, _width: columnsWidth[i] }
      }))
      if (onColumnResize) onColumnResize(formatColumns[colIndex].idx, columnsWidth[colIndex])
    }
  }, [formatColumns])

  const onAddColumnHandler = useCallback((index: number, showColumnIndex: number) => {
    if (onAddColumn) onAddColumn(index, showColumnIndex)
  }, [colSizesApi, onAddColumn])

  const [showHeaderShadow, setShowHeaderShadow] = useState(false)
  const [showPinnedLeftShadow, setShowPinnedLeftShadow] = useState(false)
  const [showPinnedRightShadow, setShowPinnedRightShadow] = useState(false)

  const [columnEditBarOffsetX, setColumnEditBarOffsetX] = useState(0)
  const onScrollContentHandler: React.UIEventHandler<HTMLDivElement> =
    useCallback((e) => {
      // 避免其他元素触发滚动事件
      if (!e.target.className.includes('simplebar-content-wrapper')) return
      
      // @ts-ignore
      const { scrollLeft, offsetWidth, scrollWidth } =
        e.target as HTMLDivElement
      setColumnEditBarOffsetX(scrollLeft)
      setShowPinnedLeftShadow(scrollLeft > 0)

      setShowPinnedRightShadow(scrollLeft < scrollWidth - offsetWidth)
      // @ts-ignore
      setShowHeaderShadow(e.target.scrollTop > 0)
    }, [])

  // hover 插入按钮
  const [hoverInsertBarIndex, setHoverInsertBarIndex] = useState<number>()
  const [editing, setEditing] = useState(false)

  return (
    <Focus
      onFocus={showEdit ? setEditing : undefined}
      onBlur={showEdit ? setEditing : undefined}
      className={classNames(preCls, className, {
        [`${preCls}--editing`]: editing
      })}
      style={style}
      excludeClassName={['titaui-popup']}
    >
      <Edit
        onAddColumn={onAddColumnHandler}
        onRemoveColumn={onRemoveColumn}
        columnOptions={formatColumns}
        onHoverInsertBar={setHoverInsertBarIndex}
        onSelectColumn={setSelectedColIndex}
        colWidth={colSizes}
        showEdit={editing}
        showInsert={showInsert}
        offsetX={columnEditBarOffsetX}
      />
      <Resize
        height={scrollHeight}
        columnOptions={formatColumns}
        onColumnResize={onColumnResizeHandler}
        hoverInsertBarIndex={hoverInsertBarIndex}
        showEdit={showEdit}
        offsetX={columnEditBarOffsetX}
      />
      <div className={`${preCls}__table-border`}>
        <div
          ref={scrollRef}
          className={classNames(`${preCls}__table-scroll`)}
          style={{ height, maxHeight }}
          onScroll={onScrollContentHandler}
        >
          <animated.div
            className={`${preCls}__table-container`}
            style={{ width: tableWidth.width }}
          >
            <table className={`${preCls}__content`}>
              {/* 列宽 */}
              <colgroup>
                {colSizes.map(({ width }, i) => (
                  <animated.col
                    key={`${i}_${formatColumns[i].title}`}
                    style={{ width: formatColumns[i].hidden ? 0 : width }}
                  />
                ))}
              </colgroup>
              {/* head */}
              <thead
                className={classNames(`${preCls}__head`, {
                  [`${preCls}__head--pinnedHeader`]: pinnedHeader,
                  [`${preCls}__head--shadow`]: showHeaderShadow,
                })}
              >
                <tr ref={headTrRef}>
                  {formatColumns.map((columnOption, colIndex) => {
                    const {
                      title,
                      canEditTitle,
                      pinnedStyle,
                      isPinned,
                      center,
                      pinnedIndex,
                      idx,
                      key,
                    } = columnOption
                    return (
                      <th
                        key={key || title}
                        className={classNames(`${preCls}__head-item`, {
                          [`${preCls}__head-item--active`]:
                            selectedColIndex === colIndex,
                          [`${preCls}__head-item--center`]: center,
                          [`${preCls}__head-item--canEdit`]: canEditTitle,
                          [`${preCls}__left-shadow`]:
                            isPinned &&
                            showPinnedLeftShadow &&
                            colIndex === pinnedIndex[0],
                          [`${preCls}__right-shadow`]:
                            isPinned &&
                            showPinnedRightShadow &&
                            colIndex === pinnedIndex[1],
                        })}
                        style={{
                          ...pinnedStyle,
                        }}
                      >
                        {canEditTitle ? (
                          <TitleInput value={title} onChangeTitle={value => {
                            if (onChangeTitle) onChangeTitle(
                              value,
                              idx,
                              columnOption,
                            )
                          }} />
                        ) : (
                          title
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>

              {/* content */}
              <tbody>
                {dataSource.map((record, rowIdx) => (
                  <tr
                    key={
                      typeof rowKey === 'string'
                        ? record[rowKey]
                        : rowKey(record, rowIdx)
                    }
                  >
                    {formatColumns.map((columnOption, colIndex) => (
                      <Box
                        key={columnOption.key || columnOption.title}
                        width={colSizes[colIndex].width}
                        className={classNames(`${preCls}__box`, {
                          [`${preCls}__left-shadow`]:
                            columnOption.isPinned &&
                            showPinnedLeftShadow &&
                            colIndex === columnOption.pinnedIndex[0],
                          [`${preCls}__right-shadow`]:
                            columnOption.isPinned &&
                            showPinnedRightShadow &&
                            colIndex === columnOption.pinnedIndex[1],
                        })}
                        record={record}
                        rowIdx={rowIdx}
                        columnOption={columnOption}
                        active={selectedColIndex === colIndex}
                        style={{
                          ...columnOption.pinnedStyle,
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </animated.div>
        </div>
      </div>
    </Focus>
  )
})

export const Table = React.memo(SuperTable)

export default Table

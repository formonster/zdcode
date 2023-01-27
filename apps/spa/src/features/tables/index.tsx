import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { ColumnOption, ColumnOptions, message, Table } from '@zdcode/ui'
import { SettingOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { usePopupCtl } from '@/features/popup/index.store'
import useUrlState from '@ahooksjs/use-url-state'
import { Table as TableType, useTables, useColumns, useData, createTable, createColumn, Column, removeTable, removeColumn, responseError, del, work, Work } from '@zdcode/superdb'
import ColumnTitle, { Action } from './components/column-title'
import './index.scss'

const { confirm } = Modal;

const preCls = 'features-tables'

export default function Counter() {
  const tableDataPopupCtl = usePopupCtl('tableData')

  const tablesFetch = useTables()
  const tables = tablesFetch.data

  const [urlState, setUrlState] = useUrlState({ tableName: '' });

  const [currentTable, setCurrentTable] = useState<TableType>()
  const tableColumnsFetch = useColumns(currentTable?.name)
  const tableColumns = tableColumnsFetch.data

  const tableDataFetch = useData(currentTable?.name)
  const tableData = tableDataFetch.data

  useEffect(() => {
    if (currentTable?.name) setUrlState({ tableName: currentTable?.name })
  }, [currentTable?.name])

  useEffect(() => {
    if (!currentTable && tables.length) {
      if (!urlState.tableName) {
        setCurrentTable(tables[0])
        return
      }

      setCurrentTable(tables.find(({ name }) => name === urlState.tableName) || tables[0])
    }
  }, [tables])

  const onAddTable = () => {
    tableDataPopupCtl.show({
      title: '新增表格',
      tableName: 'tables',
      onBeforeChange: async (data) => {
        const res = await createTable(data.name, data.title)
        if (responseError(res)) return false
        message.success('创建成功！')
        tablesFetch.refresh()
        return false
      }
    })
  }
  const onRemoveTable = () => {
    confirm({
      title: '确定删除该表格吗？',
      icon: <ExclamationCircleFilled />,
      content: '删除后不可恢复，且数据会被删除！',
      okType: 'danger',
      async onOk() {
        if (currentTable) {
          const res = await removeTable(currentTable.name, currentTable.id as number)
          if (responseError(res)) return
          message.success('删除成功！')

          setCurrentTable(tables[currentTableIndex.current - 1])
          tablesFetch.refresh()
        }
      },
    });
  }
  const currentTableIndex = useRef<number>(0)
  const onSelectTable = (idx: number) => {
    currentTableIndex.current = idx
    urlState.tableName = tables[idx].name
    setUrlState({ ...urlState })
    setCurrentTable(tables[idx])
  }

  const onColumnActionHandler = useCallback((id: number, action: Action, columnName: string) => {
    switch (action) {
      case 'edit':
        tableDataPopupCtl.show({
          title: '修改列',
          tableName: 'table_column',
          dataId: id,
          onBeforeChange: async (data, oldData) => {
            if (!currentTable) return false

            const name = data.name || oldData.name
            const type = data.type || oldData.type
            const length = data.length || oldData.length
            const default_value = data.default_value || oldData.default_value

            const works: Work[] = [
              {
                type: 'put',
                table: 'table_column',
                where: { id },
                data
              }
            ]

            // 如果修改了名称
            if (data.name) {
              works.push({
                type: 'renameColumn',
                tableName: currentTable.name,
                columnName: oldData.name,
                newColumnName: data.name
              })
            }
            if (data.type || data.not_null || data.length || data.default_value) {
              works.push({
                type: 'updateColumn',
                tableName: currentTable.name,
                column: { ...data, name, type, length, default_value } as Column
              })
            }
            await work(works)
            message.success('修改成功！')
            tableColumnsFetch.refresh()
            return false
          }
        })
        break
      case 'delete':
        confirm({
          title: '确定删除该列吗？',
          icon: <ExclamationCircleFilled />,
          content: '删除后不可恢复，且数据会被删除！',
          okType: 'danger',
          async onOk() {
            if (currentTable) {
              const res = await removeColumn(currentTable.name, columnName, id)

              if (responseError(res)) return false
              message.success('删除成功！')
              tableColumnsFetch.refresh()
            }
          },
        });
        break
    }
  }, [currentTable])

  /** 修改数据 */
  const onUpdateDataHandler = async (id: number) => {
    if (!currentTable) return
    tableDataPopupCtl.show({
      title: '修改数据',
      dataId: id,
      tableName: currentTable.name,
      onChange: () => {
        tableDataFetch.refresh()
      }
    })
  }

  /** 删除数据 */
  const onRemoveDataHandler = async (id: number) => {
    if (!currentTable) return

    confirm({
      title: '确定删除该数据吗？',
      icon: <ExclamationCircleFilled />,
      content: '删除后不可恢复！',
      okType: 'danger',
      async onOk() {
        const res = await del(currentTable?.name, {
          where: { id }
        })
        if (responseError(res)) return false
        message.success('删除成功！')
        tableDataFetch.refresh()
      }
    });
  }

  const columns = useMemo<ColumnOptions<any>>(() => {
    return [
      ...tableColumns.map(({ name, id }) => ({
        title: <ColumnTitle onAction={onColumnActionHandler} id={id as number} name={name} />,
        key: id,
        dataIndex: name
      })) || [],
      {
        title: '操作',
        dataIndex: 'id',
        width: 120,
        render: ({ value }) => (
          <p className='space-x-2'>
            <a className='text-red-500 text-sm' onClick={() => onRemoveDataHandler(value)}>删除</a>
            <a className='text-sm' onClick={() => onUpdateDataHandler(value)}>编辑</a>
          </p>
        )
      }
    ]
  }, [tableColumns, onColumnActionHandler])

  const onAddColumn = useCallback(() => {
    if (!currentTable) return

    tableDataPopupCtl.show({
      title: '新增列',
      tableName: 'table_column',
      formData: {
        table_id: currentTable.id
      },
      onBeforeChange: async (data) => {
        const res = await createColumn(currentTable.name, data as Column)
        if (responseError(res)) return false
        tableColumnsFetch.refresh()
        message.success('新增成功！')
        return false
      }
    })
  }, [currentTable])

  const onAddData = () => {
    if (!currentTable) return

    tableDataPopupCtl.show({
      title: '新增数据',
      tableName: currentTable.name,
      onChange: () => {
        message.success('新增成功！')
        tableDataFetch.refresh()
      }
    })
  }

  return (
    <div className={classNames(preCls, 'flex w-full')}>
      <div className={classNames("w-52 h-full p-4 border border-r-slate-200 shrink-0")}>
        {tables.map(({ name, id }, i) => (
          <div key={id} onClick={() => onSelectTable(i)} className={classNames('px-3 py-2 cursor-pointer hover:bg-slate-400 rounded-md', {
            'bg-slate-600 text-slate-100': urlState.tableName === name
          })}>{name}</div>
        ))}
        <Button className="mt-3" onClick={onAddTable} block>新增表格</Button>
      </div>
      <div className='w-full'>
        {/* 头部 */}
        <div className='flex justify-between py-3 px-4'>
          <div className='flex items-center font-bold space-x-2'>
            <p>{currentTable?.name}</p>
            <Button type="text" shape="circle" icon={<SettingOutlined />} />
          </div>
          {/* {!currentTable?.is_original && ( */}
            <div className='space-x-2'>
              <Button onClick={onAddColumn} type="primary">新增列</Button>
              <Button onClick={onAddData} type="primary">新增数据</Button>
              <Button onClick={onRemoveTable} type="primary" danger>删除表格</Button>
            </div>
          {/* )} */}
        </div>

        {/* 数据 */}
        <div className='py-3 px-4'>
          <Table dataSource={tableData || []} columns={columns} rowKey="id" showEdit />
        </div>
      </div>
    </div>
  )
}

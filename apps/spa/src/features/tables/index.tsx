import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Button, ColumnOption, ColumnOptions, Table } from '@zdcode/ui'
import { SettingOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import { usePopupCtl } from '@/features/popup/index.store'
import useUrlState from '@ahooksjs/use-url-state'
import { Table as TableType, useTables, useColumns, useData, createTable, createColumn, Column, removeTable, removeColumn } from '@zdcode/superdb'
import ColumnTitle, { Action } from './components/column-title'
import './index.scss'

const { confirm } = Modal;

const preCls = 'features-tables'

export default function Counter() {
  const tableDataPopupCtl = usePopupCtl('tableData')
  const tables = useTables()

  const [urlState, setUrlState] = useUrlState({ tableName: '' });

  const [currentTable, setCurrentTable] = useState<TableType>()
  const tableColumns = useColumns(currentTable?.name)
  const tableData = useData(currentTable?.name)

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
      onChange: async (data) => {
        const res = await createTable(data.name, data.title)
      }
    })
  }
  const onRemoveTable = () => {
    confirm({
      title: '确定删除该表格吗？',
      icon: <ExclamationCircleFilled />,
      content: '删除后不可恢复，且数据会被删除！',
      okType: 'danger',
      onOk() {
        if (currentTable) removeTable(currentTable.name)
      },
    });
  }
  const onSelectTable = (idx: number) => {
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
          dataId: id
        })
        break
      case 'delete':
        confirm({
          title: '确定删除该列吗？',
          icon: <ExclamationCircleFilled />,
          content: '删除后不可恢复，且数据会被删除！',
          okType: 'danger',
          onOk() {
            if (currentTable) removeColumn(currentTable.name, columnName, id)
          },
        });
        break
    }
  }, [])

  const columns = useMemo<ColumnOptions<any>>(() => {
    return tableColumns.data?.map<ColumnOption>(({ name, id }) => ({
      title: <ColumnTitle onAction={onColumnActionHandler} id={id as number} name={name} />,
      key: id,
      dataIndex: name
    })) || []
  }, [tableColumns, onColumnActionHandler])

  const onAddColumn = useCallback(() => {
    if (!currentTable) return

    tableDataPopupCtl.show({
      title: '新增列',
      tableName: 'table_column',
      formData: {
        table_id: currentTable.id
      },
      onChange: async (data: Column) => {
        console.log('data', data);
        const res = await createColumn(currentTable.name, data)
      }
    })
  }, [currentTable])

  const onAddData = () => {
    if (!currentTable) return

    tableDataPopupCtl.show({
      title: '新增数据',
      tableName: currentTable.name,
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
        <Button className="mt-3" onClick={onAddTable} block>新增</Button>
      </div>
      <div className='w-full'>
        {/* 头部 */}
        <div className='flex justify-between py-3 px-4'>
          <div className='flex items-center font-bold space-x-2'>
            <p>{currentTable?.name}</p>
            <Button type="text" shape="circle" icon={<SettingOutlined />} />
          </div>
          <div className='space-x-2'>
            <Button onClick={onAddColumn} type="primary">新增列</Button>
            <Button onClick={onAddData} type="primary">新增数据</Button>
            <Button onClick={onRemoveTable} type="primary" danger>删除表格</Button>
          </div>
        </div>

        {/* 数据 */}
        <div className='py-3 px-4'>
          <Table dataSource={tableData.data || []} columns={columns} rowKey="id" showEdit />
        </div>
      </div>
    </div>
  )
}

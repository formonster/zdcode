import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Button, ColumnOption, ColumnOptions, Table } from '@zdcode/ui'
import { SettingOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import { usePopupCtl } from '@/features/popup/index.store'
import useUrlState from '@ahooksjs/use-url-state'
import { Table as TableType, useTables, useColumns, useData } from '@zdcode/superdb'
import ColumnTitle, { Action } from './components/column-title'
import './index.scss'

const { confirm } = Modal;

const preCls = 'features-tables'

export default function Counter() {
  const tableDataPopupCtl = usePopupCtl('tableData')
  const tablesRes = useTables()
  const tables = tablesRes.data || []

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
    })
  }

  const onSelectTable = (idx: number) => {
    urlState.tableName = tables[idx].name
    setUrlState({ ...urlState })
    setCurrentTable(tables[idx])
  }

  const onColumnActionHandler = useCallback((id: number, action: Action) => {
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
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
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

  return (
    <div className={classNames(preCls, 'flex w-full')}>
      <div className={classNames("w-52 h-full p-4 border border-r-slate-200 shrink-0")}>
        {tables.map(({ name, id }, i) => (
          <div key={id} onClick={() => onSelectTable(i)} className='px-3 py-2 cursor-pointer hover:bg-slate-400 rounded-md'>{name}</div>
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
          <div>
            <Button type="primary">新增数据</Button>
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

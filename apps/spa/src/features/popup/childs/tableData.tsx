import React, { FC, useEffect, useState } from 'react'
import { Column, useColumns, put, add } from '@zdcode/superdb'
import { Modal } from 'antd'
import { usePopup, PopupStateValue } from '@/features/popup'
import CustomForm, { CustomFormColumn } from '@/components/custom-form'

export interface TableDataPopupProps extends PopupStateValue {
  tableName: string
  dataId?: number
  onChange?: (formData: Record<string, any>) => void
}

const getFormType = (column: Column) => {
  switch (column.type) {
    case "CHAR":
      return { type: 'input', label: column.title, name: column.name }
    case "INT":
      return { type: 'number', label: column.title, name: column.name }
    case 'VARCHAR':
      return { type: 'input', label: column.title, name: column.name }
    case "BOOLEAN":
      return { type: 'switch', label: column.title, name: column.name }
    case 'RELATION':
      return {
        type: 'select',
        label: column.title,
        name: column.name,
        // TODO 处理 relation_table_id & relation_table_column_id，加载对应的数据
        selectProps: {
          relationTableId: column.relation_table_id,
          relationTableColumnId: column.relation_table_column_id,
        },
      }
    case 'ENUM':
      return {
        type: 'select',
        label: column.title,
        name: column.name,
        selectProps: {
          enumId: column.enum_id,
        },
      }
  }
}

const TableData: FC = function () {
  const [popup, popupCtl] = usePopup('tableData')

  const tableColumns = useColumns(popup.tableName)
  const columns: CustomFormColumn = tableColumns.data?.map(getFormType) || []

  // const formData = useSWR(`tableColumnData:${popup.dataId}`, fetch.get({
  //   table: 'table_column',
  //   where: {
  //     id: popup.dataId
  //   }
  // }))

  useEffect(() => {
    if (!popup.visible) {

    }
  }, [popup.visible])

  const onChangeData = async (data: any) => {
    if (popup.onChange) {
      popup.onChange(data)
      popupCtl.hide()
      return
    }

    let newData = null
    if (popup.dataId) {
      newData = {
        ...data,
        id: popup.dataId,
      }
      await put(popup.tableName, {
        data: newData,
        where: { id: popup.dataId }
      })
    } else {
      const res = await add(popup.tableName, {
        data,
      })
      newData = res.data
    }
    popupCtl.hide()
  }

  return (
    <>
      <Modal
        title={popup.title}
        visible={popup.visible}
        onOk={() => popupCtl.hide()}
        onCancel={() => popupCtl.hide()}
        footer={false}
        destroyOnClose
      >
        <CustomForm
          columns={columns}
          defaultValue={popup.formData}
          onChange={onChangeData}
        />
      </Modal>
    </>
  )
}

export default TableData

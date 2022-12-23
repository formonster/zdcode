import React, { FC, useEffect, useState } from 'react'
import { Column, useColumns } from '@zdcode/superdb'
import { Modal } from 'antd'
import { useSWR } from 'swr'
import { usePopup, PopupStateValue } from '@/features/popup'
import CustomForm, { CustomFormColumn } from '@/components/custom-form'
import fetch from '@/utils/fetch'

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
    let newData = null
    if (popup.dataId) {
      newData = {
        ...data,
        id: popup.dataId,
      }
      await fetch.put({
        table: popup.tableName,
        data: newData,
      })
    } else {
      const res = await fetch.add({
        table: popup.tableName,
        data,
      })
      newData = res.data.data
    }
    popup.onChange(newData)
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

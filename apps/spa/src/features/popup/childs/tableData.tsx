import React, { FC, useEffect, useRef, useState } from 'react'
import { Column, useColumns, put, add, get, responseError } from '@zdcode/superdb'
import { useFetch } from '@zdcode/fetch'
import { record, RecordCtl } from '@zdcode/utils'
import { Modal } from 'antd'
import { usePopup, PopupStateValue } from '@/features/popup'
import CustomForm, { CustomFormColumn } from '@/components/custom-form'

export interface TableDataPopupProps extends PopupStateValue {
  tableName: string
  dataId?: number
  formData?: Record<string, any>
  onChange?: (formData: Record<string, any>) => void
  onBeforeChange?: (formData: Record<string, any>) => boolean | Promise<boolean>
}

const getFormType = (column: Column): CustomFormColumn => {
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
    default:
      return { type: 'input', label: column.title, name: column.name }
  }
}

const TableData: FC = function () {
  const [popup, popupCtl] = usePopup('tableData')
  const { visible, tableName, onBeforeChange, onChange, dataId } = popup

  const tableColumns = useColumns(tableName)
  const columns: CustomFormColumn = tableColumns.data.map(getFormType) || []

  const formDataFetch = useFetch(async () => {
    if (!dataId) return {}
    if (popup.formData) return popup.formData
    const res = await get(tableName, {
      where: {
        id: dataId
      }
    })
    if (responseError(res)) return {}
    return res.data
  }, {}, [dataId, popup.formData])

  const diffDataRef = useRef<RecordCtl>()
  useEffect(() => {
    if (visible && dataId && formDataFetch.data && !formDataFetch.loading) {
      diffDataRef.current = record(formDataFetch.data)
    }
  }, [visible, dataId, formDataFetch.loading])

  const onChangeData = async (data: any) => {
    let newData = data
    if (dataId) {
      newData = diffDataRef.current?.diff(newData, ['id'])

      if (onBeforeChange) {
        const next = await onBeforeChange(newData)
        if (!next) {
          popupCtl.hide()
          return
        }
      }
      await put(tableName, {
        data: newData,
        where: { id: dataId }
      })
    } else {
      if (onBeforeChange) {
        const next = await onBeforeChange(data)
        if (!next) {
          popupCtl.hide()
          return
        }
      }
      const res = await add(popup.tableName, {
        data,
      })
      newData = res.data
    }

    if (onChange) onChange(newData)
    popupCtl.hide()
  }
  
  return (
    <>
      <Modal
        title={popup.title}
        open={popup.visible}
        onOk={() => popupCtl.hide()}
        onCancel={() => popupCtl.hide()}
        footer={false}
        destroyOnClose
      >
        {!formDataFetch.loading && (
          <CustomForm
            columns={columns}
            defaultValue={formDataFetch.data}
            onChange={onChangeData}
          />
        )}
      </Modal>
    </>
  )
}

export default TableData

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
  retain?: string[]
  formData?: Record<string, any>
  onChange?: (formData: Record<string, any>) => void
  onBeforeChange?: (formData: Record<string, any>, oldFormData: Record<string, any>) => boolean | Promise<boolean>
}

const getFormType = (column: Column): CustomFormColumn => {
  let option = {
    type: 'input',
    label: column.title,
    name: column.name,
    require: !!column.not_null,
    initialValue: column.default_value
  }
  switch (column.type) {
    case "INT":
      // @ts-ignore
      option.type = 'number' 
      break
    case "BOOLEAN":
      // @ts-ignore
      option.type = 'switch' 
      break
    case 'RELATION':
      // @ts-ignore
      option.type = 'select'
      // @ts-ignore
      option.selectProps = {
        relationTableId: column.relation_table_id,
        relationTableColumnId: column.relation_table_column_id,
      }
      break
    case 'ENUM':
      // @ts-ignore
      option.type = 'select'
      // @ts-ignore
      option.selectProps = {
        enumId: column.enum_id,
      }
      break
  }
  return option as unknown as CustomFormColumn
}

const TableData: FC = function () {
  const [popup, popupCtl] = usePopup('tableData')
  const { visible, tableName, onBeforeChange, onChange, dataId, retain = [] } = popup

  const tableColumns = useColumns(tableName)
  console.log('tableColumns', tableColumns)
  const columns: CustomFormColumn = tableColumns.data.map(getFormType) || []

  const formDataFetch = useFetch(async () => {
    if (popup.formData) return popup.formData
    if (!dataId) return {}
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
      newData = diffDataRef.current?.diff(newData, ['id', ...retain])

      if (onBeforeChange) {
        const next = await onBeforeChange(newData, formDataFetch.data)
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
        const next = await onBeforeChange(data, formDataFetch.data)
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

// @ts-nocheck
import React, { FC, useEffect, useState } from 'react'
import {
  Input,
  Select,
  Upload,
  Form,
  Button,
  FormItemProps,
  ColProps,
  Col,
  Row,
  Checkbox,
  CheckboxOptionType,
  Divider,
  DividerProps,
  Switch,
  InputNumber
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadListProps } from 'antd/lib/upload'
import { Gutter } from 'antd/lib/grid/row'
import { get, list } from '@zdcode/superdb'

const { Option } = Select

export type CustomFormItemType =
  | 'input'
  | 'select'
  | 'checkbox'
  | 'upload'
  | 'uploadImg'

export interface CustomFormItem<T = any> extends FormItemProps<T> {
  type: CustomFormItemType
  label: string
  name: string
  span?: ColProps['span']
  placeholder?: string
  message?: string
  require?: boolean
  selectProps?: {
    datas:
      | { name: string; value: string | number }[]
      | { [key: string]: string | number }
    enumId: string
  }
  checkboxProps?: {
    options: (string | number | CheckboxOptionType)[]
  }
  switchProps?: {
    checked: boolean
  }
  uploadProps?: {
    name?: string
    accept?: string
    action?: string
    listType?: UploadListProps
    maxCount?: number
  }
  render?: (value: any, item: object, index: number) => React.ReactNode
  format?: (self: any, forData: T) => any
}

export interface DividerItem extends DividerProps {
  divider: boolean
  title: string
}
export type CustomFormColumn = (CustomFormItem | DividerItem)[]

export type CustomFormProps<T = object> = {
  columns: CustomFormColumn
  gutter?: Gutter
  defaultValue: T
  onChange?: (value: T) => void
}

function getOptions(data: { name: string; value: string | number }[] = []) {
  if (Array.isArray(data)) {
    return data.map(({ name, value }) => (
      <Option key={`${name}_${value}`} value={value}>
        {name}
      </Option>
    ))
  } else if (typeof data === 'object') {
    return Object.entries(data).map(([name, value]) => (
      <Option key={`${name}_${value}`} value={value}>
        {name}
      </Option>
    ))
  }
}

const MySelect = ({ datas, enumId, relationTableId, relationTableColumnId, placeholder, ...args }) => {
  const [menuData, setMenuData] = useState(datas || [])

  const getEnumData = () => {
    list('enums_item', {
      where: {
        enum_id: enumId,
      },
    }).then((enumItemRes) => {
      const enumItems = enumItemRes.data
      const data = enumItems?.map((item) => ({
        name: item.name,
        value: item.name,
      }))
      setMenuData(data)
    })
  }

  const getRelationData = async () => {
    const tableRes = await get('tables', {
      where: {
        id: relationTableId
      }
    })
    const name = tableRes.data.name
    const tableColumnRes = await get('table_column', {
      where: {
        id: relationTableColumnId
      }
    })
    const columnName = tableColumnRes.data.name
    const dataRes = await list(name, {
      columns: ['id', columnName]
    })
    console.log('dataRes.data', name, dataRes.data);
    
    setMenuData(dataRes.data.map((dataItem) => ({
      name: dataItem[columnName],
      value: dataItem.id
    })))
  }

  useEffect(() => {
    if (enumId) getEnumData()
    if (relationTableId && relationTableColumnId) getRelationData()
  }, [enumId, relationTableId, relationTableColumnId])

  return (
    <Select placeholder={placeholder} {...args}>
      {getOptions(menuData)}
    </Select>
  )
}

const customFormComponents: {
  [key in CustomFormItemType]: (props: CustomFormItem) => React.ReactNode
} = {
  input: (props: CustomFormItem) => <Input placeholder={props.placeholder} />,
  number: (props: CustomFormItem) => <InputNumber placeholder={props.placeholder} />,
  select: (props: CustomFormItem) => (
    <MySelect
      placeholder={props.placeholder}
      {...props.selectProps}
    />
  ),
  checkbox: (props: CustomFormItem) => (
    <Checkbox.Group options={props.checkboxProps.options} />
  ),
  switch: (props: CustomFormItem) => (
    <Switch {...props.switchProps} />
  ),
  upload: (props: CustomFormItem) => (
    <Upload
      name={props.uploadProps.name}
      action={props.uploadProps.action}
      listType='picture'
    >
      <Button icon={<UploadOutlined />}>Click to upload</Button>
    </Upload>
  ),
  uploadImg: (props: CustomFormItem) => <Upload></Upload>,
}

const object2FieldData = (object: {}) =>
  Object.entries(object).map(([label, value]) => ({ name: label, value }))

const CustomForm: FC<CustomFormProps> = ({
  columns,
  gutter = 16,
  defaultValue,
  onChange,
}) => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    columns.forEach((item) => {
      if ('format' in item) values = item.format(values[item.name], values)
    })
    onChange(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      name='basic'
      form={form}
      initialValues={defaultValue}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Row gutter={gutter}>
        {columns.map((item, i) => {
          // 分割线
          if ('divider' in item)
            return <Divider {...item}>{item.title}</Divider>

          const { name, label, require, message, type, span = 24, ...props } = item
          return (
            <Col key={i} span={span}>
              <Form.Item
                key={name}
                label={label}
                name={name}
                rules={[{ required: require, message: message }]}
                {...props}
              >
                {customFormComponents[type](item)}
              </Form.Item>
            </Col>
          )
        })}
      </Row>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CustomForm

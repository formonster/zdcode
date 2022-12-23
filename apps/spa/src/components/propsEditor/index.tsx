import React, { FC, useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Table, Input, InputNumber, Switch, Select } from 'antd'
import styles from './index.module.css'
import { SyntaxKind } from 'typescript'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { ColumnsType } from 'antd/lib/table'
import JsonEditor from '../jsonEditor'

const { Option } = Select
const { TextArea } = Input

type Tags = 'edit' | 'default' | string
type EditType = 'string' | 'textarea' | 'json' | 'number' | 'switch' | 'select'

export interface PropsOption {
  name: string
  remarks: string
  tags: Record<Tags, any>
  require: boolean
  kind: SyntaxKind
  attribute: PropsOption[]
  selectOptions: (string | number)[]
}
export interface PropsOptionLink extends PropsOption {
  backKeys: string[]
  back: PropsOptionLink | undefined
}

export type PropsOptions = PropsOption[]

export interface IPropsEditorProps {
  options: PropsOption[]
  defaultPorps: Record<string, any>
  onChangePorps?: (props: Record<string, any>) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const PropsEditor: FC<IPropsEditorProps> = ({
  className,
  style,
  options,
  defaultPorps,
  onChangePorps,
}) => {
  const [props, setProps] = useState<Record<string, any>>(defaultPorps)

  const optionsLink = useMemo(() => {
    if (!options) return []
    const _options = cloneDeep(options)
    const deep = (
      options: PropsOptions,
      backKeys: string[] = [],
      back?: PropsOptionLink
    ) => {
      options.forEach((value) => {
        const valueLink: PropsOptionLink = value as PropsOptionLink
        if (value.attribute?.length > 0) {
          deep(
            value.attribute,
            [...backKeys, value.name],
            value as PropsOptionLink
          )
        }
        valueLink.backKeys = backKeys
        valueLink.back = back
      })
    }
    deep(_options)
    return _options
  }, [options])

  const onChangePropsValue = useCallback(
    (value: any, data: PropsOptionLink) => {
      set(props, [...data.backKeys, data.name].join('.'), value)
      setProps({ ...props })
      if (onChangePorps) onChangePorps({ ...props })
    },
    [props, onChangePorps]
  )

  const columns = [
    {
      title: '属性名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '说明',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '默认值',
      key: 'default',
      render: (data: PropsOption) => data.tags?.default || '-',
    },
    {
      title: '必填',
      dataIndex: 'require',
      key: 'require',
      render: (value: boolean) => (value ? '是' : '否'),
    },
    {
      title: '操作',
      dataIndex: 'kind',
      key: 'kind',
      render: (value: SyntaxKind, data: PropsOptionLink) => {
        // @ts-ignore
        const kindType: EditType = {
          [SyntaxKind.StringKeyword]: 'string',
          [SyntaxKind.NumberKeyword]: 'number',
          [SyntaxKind.BooleanKeyword]: 'switch',
          [SyntaxKind.UnionType]: 'select',
        }[value]

        const type: EditType = data.tags.editType || kindType
        switch (type) {
          case 'string':
            return (
              <Input
                defaultValue={data.tags.default}
                onChange={(e) => onChangePropsValue(e.target.value, data)}
              />
            )
          case 'textarea':
            return (
              <TextArea
                defaultValue={data.tags.default}
                onChange={(e) => onChangePropsValue(e.target.value, data)}
              />
            )
          case 'json':
            return (
              <JsonEditor
                defaultValue={data.tags.editData || data.tags.default}
                onChange={(json) => {
                  try {
                    const value = JSON.parse(json)
                    onChangePropsValue(value, data)
                  } catch (error) {
                    onChangePropsValue(data.tags.isArray ? [] : {}, data)
                  }
                }}
              />
            )
          case 'number':
            return (
              <InputNumber
                defaultValue={data.tags.default}
                onChange={(value) => onChangePropsValue(value, data)}
              />
            )
          case 'switch':
            return (
              <Switch
                defaultChecked={data.tags.default === 'true'}
                onChange={(checked) => onChangePropsValue(checked, data)}
              />
            )
          case 'select':
            return (
              <Select
                className='w-full'
                defaultValue={data.tags.default}
                onChange={(value) => onChangePropsValue(value, data)}
              >
                {data.selectOptions.map((value) => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )
          default:
            return (
              <Input
                defaultValue={data.tags.default}
                onChange={(e) => onChangePropsValue(e.target.value, data)}
              />
            )
        }
      },
    },
  ]

  const rowExpandable = useCallback(
    (record: PropsOption) => record.attribute && record.attribute.length > 0,
    []
  )

  const expandedRowRender = (record: PropsOption) => {
    return (
      <Table
        size='small'
        dataSource={record.attribute}
        // @ts-ignore
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowRender,
          rowExpandable,
        }}
      />
    )
  }

  return (
    <div className={classNames(styles.propsEditor, className)} style={style}>
      <div>
        <Table
          size='small'
          dataSource={optionsLink}
          // @ts-ignore
          columns={columns}
          pagination={false}
          expandable={{
            expandedRowRender,
            rowExpandable,
          }}
        />
      </div>
    </div>
  )
}

export default React.memo(PropsEditor)

import React, { FC, useCallback, useMemo } from 'react'
import { Button } from '@zdcode/ui'
import { Dropdown, MenuProps } from 'antd'
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import classNames from 'classnames'

export type Action = 'edit' | 'delete'

export interface IColumnTitleProps {
  id: number
  name: string
  onAction: (id: number, action: Action) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const ColumnTitle: FC<IColumnTitleProps> = ({ name, id, onAction }) => {
  const columnMenuItems = useMemo<MenuProps['items']>(() => {
    return [
      {
        key: 'edit',
        label: '修改',
        icon: <EditOutlined />
      },
      {
        key: 'delete',
        label: '删除',
        danger: true,
        icon: <DeleteOutlined />
      },
    ]
  }, [])

  const onClickMenuItem = useCallback(({ key }: { key: Action }) => {
    onAction(id, key as Action, name)
  }, [id, onAction])

  return (
    <div className={classNames('flex justify-between items-center')}>
      <p>{name}</p>
      <div className='flex'>
        <Dropdown menu={{ items: columnMenuItems, onClick: onClickMenuItem }}>
          <Button type="text" shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </div>
  )
}

export default React.memo(ColumnTitle)

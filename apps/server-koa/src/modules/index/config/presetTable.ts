import { Column } from "@zdcode/superdb";

const presetTable: {
  name: string;
  title: string;
  is_original: boolean;
  columns: Column[]
}[] = [
  {
    name: 'tables',
    title: '表格',
    is_original: true,
    columns: [
      {
        name: 'name',
        title: '表名称',
        type: 'CHAR',
        length: 100,
      },
      {
        name: 'title',
        title: '表标题',
        type: 'VARCHAR',
        length: 100,
      },
      {
        name: 'is_original',
        title: '是否是源表',
        type: 'BOOLEAN',
        default_value: false
      },
    ],
  },
  {
    name: 'table_column',
    title: '表格列',
    is_original: true,
    columns: [
      {
        name: 'table_id',
        title: '所属表ID',
        type: 'INT',
      },
      {
        name: 'name',
        title: '列名称',
        type: 'CHAR',
        length: 100,
      },
      {
        name: 'title',
        title: '列标题',
        type: 'VARCHAR',
        length: 100,
      },
      {
        name: 'comment',
        title: '列说明',
        type: 'VARCHAR',
      },
      {
        name: 'type',
        title: '列类型',
        type: 'CHAR',
        length: 100,
      },
      {
        name: 'length',
        title: '数据长度',
        type: 'INT',
      },
      {
        name: 'enum_id',
        title: '枚举ID',
        type: 'INT',
      },
      {
        name: 'enum_item_id',
        title: '枚举项目ID',
        type: 'INT',
      },
      {
        name: 'relation_table_id',
        title: '关联表ID',
        type: 'INT',
      },
      {
        name: 'relation_table_column_id',
        title: '关联字段ID',
        type: 'INT',
      },
      {
        name: 'not_null',
        title: '是否允许为空',
        type: 'BOOLEAN',
      },
      {
        name: 'default_value',
        title: '默认值',
        type: 'VARCHAR',
      },
    ],
  },
  {
    name: 'enums',
    title: '枚举表',
    is_original: true,
    columns: [
      {
        name: 'name',
        title: '枚举名称',
        type: 'CHAR',
        length: 100,
      },
      {
        name: 'title',
        title: '枚举标题',
        type: 'VARCHAR',
        length: 100,
      },
      {
        name: 'comment',
        title: '枚举说明',
        type: 'VARCHAR',
        length: 255,
      },
    ],
  },
  {
    name: 'enums_item',
    title: '枚举项目表',
    is_original: true,
    columns: [
      {
        name: 'enum_id',
        title: '枚举ID',
        type: 'INT',
      },
      {
        name: 'name',
        title: '枚举项目名称',
        type: 'CHAR',
        length: 100,
      },
      {
        name: 'title',
        title: '枚举项目标题',
        type: 'VARCHAR',
        length: 100,
      },
      {
        name: 'remarks',
        title: '枚举项目说明',
        type: 'VARCHAR',
        length: 255,
      },
    ],
  },
]

export default presetTable

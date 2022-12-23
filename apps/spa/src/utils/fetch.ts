import Fetch from '@zdcode/fetch'

const fetch = Fetch<'tables' | 'table_column' | 'enum' | 'enum_item'>({ baseURL: ' http://localhost:4600' })

export default fetch
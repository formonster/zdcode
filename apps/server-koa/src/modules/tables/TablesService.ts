import { ITablesService } from './TablesInterface'

class TablesService implements ITablesService {
  hello(): string {
    return 'Hello ITablesService!'
  }
}

export default TablesService

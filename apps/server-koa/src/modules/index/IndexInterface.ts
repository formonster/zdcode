import { Column } from '@zdcode/superdb'
import { Response } from '../../types/IData'

export interface IIndexService {
  hello(): string
  check(): Response<boolean>
}

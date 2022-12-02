import { Response } from '../../types/IData'

export interface IndexServiceI {
  hello(): string
  check(): Response<boolean>
}

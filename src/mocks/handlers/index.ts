import { authHandlers } from './auth'
import { eventHandlers } from './events'
import { supplierHandlers } from './suppliers'
import { caseHandlers } from './cases'

export const handlers = [
  ...authHandlers,
  ...eventHandlers,
  ...supplierHandlers,
  ...caseHandlers,
]

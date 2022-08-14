import { OrderStatus } from "../models/interfaces"

export const ORDER_STATUS_CONFIRMAR    = 'confirmar'
export const ORDER_STATUS_CONFIRMADO   = 'confirmado'
export const ORDER_STATUS_PREPARANDO   = 'preparando'
export const ORDER_STATUS_FINALIZANDO  = 'finalizando'
export const ORDER_STATUS_FINALIZADO   = 'finalizado'
export const ORDER_STATUS_CANCELADO    = 'cancelado'
export const ORDER_ACTIVE_STATUTES: OrderStatus[]  = [
   ORDER_STATUS_CONFIRMAR,
   ORDER_STATUS_CONFIRMADO,
   ORDER_STATUS_PREPARANDO,
   ORDER_STATUS_FINALIZANDO,
]
export const ORDER_INACTIVE_STATUSES: OrderStatus[] = [
   ORDER_STATUS_FINALIZADO,
   ORDER_STATUS_CANCELADO
]
export const ORDER_STATUSES: OrderStatus[] = [
   ...ORDER_ACTIVE_STATUTES,
   ...ORDER_INACTIVE_STATUSES
]

export const SUNDAY = 'Domingo'
export const MONDAY = 'Segunda'
export const TUESDAY = 'Terça'
export const WEDNESDAY = 'Quarta'
export const THURSDAY = 'Quinta'
export const FRIDAY = 'Sexta'
export const SATURDAY = 'Sábado'
export const WEEK_DAYS = [
   MONDAY,
   TUESDAY,
   WEDNESDAY,
   THURSDAY,
   FRIDAY,
   SATURDAY,
   SUNDAY
]

export const ORDER_STATUS_CONFIRMAR    = 'confirmar'
export const ORDER_STATUS_CONFIRMADO   = 'confirmado'
export const ORDER_STATUS_PREPARANDO   = 'preparando'
export const ORDER_STATUS_FINALIZANDO  = 'finalizando'
export const ORDER_STATUS_FINALIZADO   = 'finalizado'
export const ORDER_STATUS_CANCELADO    = 'cancelado'
export const ORDER_ACTIVE_STATUTES     = [
   ORDER_STATUS_CONFIRMAR,
   ORDER_STATUS_CONFIRMADO,
   ORDER_STATUS_PREPARANDO,
   ORDER_STATUS_FINALIZANDO,
]
export const ORDER_INACTIVE_STATUSES   =  [
   ORDER_STATUS_FINALIZADO,
   ORDER_STATUS_CANCELADO
]

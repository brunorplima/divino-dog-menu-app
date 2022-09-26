// Constant for local storages not sent yet to shopkeeper
export const CHECKOUT_STORAGE_KEY = 'menuItemGroups'

// Constant for local storages already sent to shopkeeper
export const CURRENT_ORDERS_KEY = 'currentOrderIds'


// All and any new constants should be added here.
export const ALL_KEYS = [
   CHECKOUT_STORAGE_KEY,
   CURRENT_ORDERS_KEY
] as const

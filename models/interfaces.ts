import { 
   ORDER_STATUS_CANCELADO,
   ORDER_STATUS_CONFIRMADO,
   ORDER_STATUS_CONFIRMAR,
   ORDER_STATUS_FINALIZADO,
   ORDER_STATUS_FINALIZANDO,
   ORDER_STATUS_PREPARANDO
} from '../constants/modelsConstants'

// Menu Items (Firestore path: menuItems)
export interface MenuItem {
   readonly id: string
   readonly name: string
   readonly price: number
   readonly isAvailable: boolean
   readonly listOrder: number
   readonly categoryId: string
   readonly optionIds?: string[]
   readonly toppingIds?: string[]
   readonly sauceIds?: string[]
   readonly description?: string
   readonly img?: string
   readonly promoPrice?: PromoPrice
}

// Toppings (Firestore path: toppings)
export interface Topping {
   readonly id: string
   readonly name: string
   readonly isAvailable: boolean
   readonly price?: number
}

// Sauces (Firestore path: sauces)
export interface Sauce {
   readonly id: string
   readonly name: string
   readonly isAvailable: boolean
   readonly price?: number
}

// Menu Item Options (Firestore path: menuItemOptions)
export interface MenuItemOption {
   readonly id: string
   readonly name: string
   readonly isAvailable: boolean
   readonly price?: number
}

// Categories (Firestore path: categories)
export interface Category {
   readonly id: string
   readonly name: string
   readonly listOrder: number
}

// Orders (Firestore path: orders)
export interface Order {
   readonly id: string
   readonly totalPrice: number
   readonly codeNumber: string
   readonly status: OrderStatus
   readonly items: MenuItemGroup[]
   readonly isDelivery: boolean
   readonly dateTime?: Date
   readonly statusUpdatedAt?: Date
}

// Users (firestore path: users)
export interface User {
   readonly id: string
   readonly firstName: string
   readonly lastName: string
   readonly emailAddress: string
   readonly phoneContact1?: string
   readonly addresses?: UserAddress[]
   readonly phoneContact2?: string
   readonly dateOfBirth?: Date
   readonly admin?: boolean
   readonly master?: boolean
}

// Settings (firestore path: settings)
export interface Settings {
   readonly id: string

   // details of each order on the order management section on admin page
   readonly orderDetailsOpenByDefault: boolean

   // adds/removes an "add toppings" section on item page
   readonly allowUserToAddToppings: boolean

   // adds/removes a "remove toppings" section on item page
   readonly allowUserToRemoveToppings: boolean

   // adds/removes a "special instructions" on item page
   readonly allowUserToGiveSpecialInstructions: boolean

   // the content that will be placed on the about us page
   readonly aboutUsContent: string

   // how long unconfirmed orders should take to become a canceled order in seconds
   readonly unconfirmedOrderExpiryTime: number

   // the max allowed number of addons users may add to a menuItemGroup
   readonly maxAmountOfAddons: number
}




export interface MenuItemGroup {
   readonly id: string
   readonly menuItemId: string
   readonly subTotal: number
   readonly extraToppingIds?: string[]
   readonly extraSauceIds?: string[]
}

export interface UserAddress {
   readonly description: string
   readonly zipCode: string
   readonly isMain: boolean
}

export interface PromoPrice {
   readonly price: number
   readonly dateLimit: Date
}

export type OrderStatus = typeof ORDER_STATUS_CONFIRMAR
| typeof ORDER_STATUS_CONFIRMADO
| typeof ORDER_STATUS_PREPARANDO
| typeof ORDER_STATUS_FINALIZANDO
| typeof ORDER_STATUS_FINALIZADO
| typeof ORDER_STATUS_CANCELADO

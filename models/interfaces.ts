import { 
   ORDER_STATUS_CANCELADO,
   ORDER_STATUS_CONFIRMADO,
   ORDER_STATUS_CONFIRMAR,
   ORDER_STATUS_FINALIZADO,
   ORDER_STATUS_FINALIZANDO,
   ORDER_STATUS_PREPARANDO
} from "../constants/modelsConstants"

// Menu Items (Firestore path: menuItems)
export interface MenuItem {
   readonly id: string
   readonly name: string
   readonly price: number
   readonly isAvailable: boolean
   readonly categoryId: string
   readonly options?: string[]
   readonly uniqOptions?: string[]
   readonly flavorIds?: string[]
   readonly toppingIds?: string[]
   readonly sauceIds?: string[]
   readonly description?: string
   readonly listOrder: number
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

// Flavors (Firestore path: flavors)
export interface Flavor {
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

interface PromoPrice {
   readonly price: number
   readonly dateLimit: Date
}

export type OrderStatus = typeof ORDER_STATUS_CONFIRMAR
| typeof ORDER_STATUS_CONFIRMADO
| typeof ORDER_STATUS_PREPARANDO
| typeof ORDER_STATUS_FINALIZANDO
| typeof ORDER_STATUS_FINALIZADO
| typeof ORDER_STATUS_CANCELADO

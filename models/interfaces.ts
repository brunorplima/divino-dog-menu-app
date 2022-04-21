interface PromoPrice {
   readonly price: number
   readonly dateLimit: Date
}


// Models with collections on Firebase
// Menu Items (Firestore)
export interface MenuItem {
   readonly id: string
   readonly name: string
   readonly price: number
   readonly isAvailable: boolean
   readonly categoryId: string
   readonly toppingIds: string[]
   readonly sauceIds: string[]
   readonly description?: string
   readonly promoPrice?: PromoPrice
}

// Toppings (Firestore)
export interface Topping {
   readonly id: string
   readonly name: string
   readonly price: number
   readonly isAvailable: string
}

// Sauces (Firestore)
export interface Sauce {
   readonly id: string
   readonly name: string
   readonly price: number
   readonly isAvailable: string
}

// Categories (Firestore)
export interface Category {
   readonly id: string
   readonly name: string
}

// Orders (Firestore)
export interface Order {
   readonly id: string;
   readonly totalPrice: number;
   readonly codeNumber: string;
   readonly status: string;
   readonly items: MenuItemGroup[];
   readonly dateTime: Date;
}



// Models with subCollections on Firebase
// Menu Items (Firestore: Order > MenuItemGroup)
export interface MenuItemGroup {
   readonly id: string
   readonly orderId: string
   readonly menuItemId: string
   readonly subTotal: number
   readonly extraToppingIds?: string[]
   readonly extraSauceIds?: string[]
}

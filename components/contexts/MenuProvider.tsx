import React, { createContext, ReactNode, useEffect, useState } from 'react'
import * as R from 'ramda'
import CategoryModel from '../../models/CategoryModel'
import FlavorModel from '../../models/FlavorModel'
import MenuItemModel from '../../models/MenuItemModel'
import OrderModel from '../../models/OrderModel'
import SauceModel from '../../models/SauceModel'
import ToppingModel from '../../models/ToppingModel'
import { ORDER_ACTIVE_STATUTES } from '../../constants/modelsConstants'

interface MenuContext {
   readonly menuItems: MenuItemModel[]
   readonly toppings: ToppingModel[]
   readonly sauces: SauceModel[]
   readonly flavors: FlavorModel[]
   readonly categories: CategoryModel[]
   readonly orders: OrderModel[]
   readonly existingCodeNumbers: string[]
}

export const menuContext = createContext<MenuContext>({
   menuItems: [],
   toppings: [],
   sauces: [],
   flavors: [],
   categories: [],
   orders: [],
   existingCodeNumbers: []
})

const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [menuItems, setMenuItems] = useState<MenuItemModel[]>([])
   const [toppings, setToppings] = useState<ToppingModel[]>([])
   const [sauces, setSauces] = useState<SauceModel[]>([])
   const [flavors, setFlavors] = useState<FlavorModel[]>([])
   const [categories, setCategories] = useState<CategoryModel[]>([])
   const [orders, setOrders] = useState<OrderModel[]>([])
   const [existingCodeNumbers, setExistingCodeNumbers] = useState<string[]>([])

   useEffect(() => {
      const menuItemsUnsubs = MenuItemModel.listenToAll(setMenuItems)
      const toppingsUnsubs = ToppingModel.listenToAll(setToppings)
      const saucesUnsubs = SauceModel.listenToAll(setSauces)
      const flavorsUnsubs = FlavorModel.listenToAll(setFlavors)
      const categoriesUnsubs = CategoryModel.listenToAll(setCategories)
      const ordersUnsubs = OrderModel.listenToAll(setOrders)

      return () => {
         menuItemsUnsubs()
         toppingsUnsubs()
         saucesUnsubs()
         flavorsUnsubs()
         categoriesUnsubs()
         ordersUnsubs()
      }
   }, [])

   useEffect(() => {
      const activeOrders = R.filter(o => ORDER_ACTIVE_STATUTES.includes(o.status), orders)
      const codeNumbers = R.pluck('codeNumber', activeOrders)
      if (!R.equals(codeNumbers, existingCodeNumbers)) setExistingCodeNumbers(codeNumbers)
   }, [orders])
   
   const menuModels: MenuContext = {
      menuItems,
      toppings,
      sauces,
      flavors,
      categories,
      orders,
      existingCodeNumbers
   }

   return (
      <menuContext.Provider value={menuModels}>
         {children}
      </menuContext.Provider>
   )
}

export default MenuProvider
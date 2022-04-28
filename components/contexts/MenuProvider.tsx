import React, { createContext, ReactNode, useEffect, useState } from 'react'
import CategoryModel from '../../models/CategoryModel'
import FlavorModel from '../../models/FlavorModel'
import MenuItemModel from '../../models/MenuItemModel'
import OrderModel from '../../models/OrderModel'
import SauceModel from '../../models/SauceModel'
import ToppingModel from '../../models/ToppingModel'

interface MenuContext {
   readonly menuItems: MenuItemModel[]
   readonly toppings: ToppingModel[]
   readonly sauces: SauceModel[]
   readonly flavors: FlavorModel[]
   readonly categories: CategoryModel[]
   readonly orders: OrderModel[]
}

export const menuContext = createContext<MenuContext>({
   menuItems: [],
   toppings: [],
   sauces: [],
   flavors: [],
   categories: [],
   orders: []
})

const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [menuItems, setMenuItems] = useState<MenuItemModel[]>([])
   const [toppings, setToppings] = useState<ToppingModel[]>([])
   const [sauces, setSauces] = useState<SauceModel[]>([])
   const [flavors, setFlavors] = useState<FlavorModel[]>([])
   const [categories, setCategories] = useState<CategoryModel[]>([])
   const [orders, setOrders] = useState<OrderModel[]>([])

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
   
   const menuModels: MenuContext = {
      menuItems,
      toppings,
      sauces,
      flavors,
      categories,
      orders
   }

   return (
      <menuContext.Provider value={menuModels}>
         {children}
      </menuContext.Provider>
   )
}

export default MenuProvider
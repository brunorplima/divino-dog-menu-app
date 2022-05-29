import React, { createContext, ReactNode, useEffect, useState } from 'react'
import CategoryModel from '../../models/CategoryModel'
import MenuItemOptionModel from '../../models/MenuItemOptionModel'
import MenuItemModel from '../../models/MenuItemModel'
import SauceModel from '../../models/SauceModel'
import ToppingModel from '../../models/ToppingModel'

interface MenuContext {
   readonly menuItems: MenuItemModel[]
   readonly toppings: ToppingModel[]
   readonly sauces: SauceModel[]
   readonly menuItemOptions: MenuItemOptionModel[]
   readonly categories: CategoryModel[]
}

export const menuContext = createContext<MenuContext>({
   menuItems: [],
   toppings: [],
   sauces: [],
   menuItemOptions: [],
   categories: []
})

const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [menuItems, setMenuItems] = useState<MenuItemModel[]>([])
   const [toppings, setToppings] = useState<ToppingModel[]>([])
   const [sauces, setSauces] = useState<SauceModel[]>([])
   const [menuItemOptions, setmenuItemOptions] = useState<MenuItemOptionModel[]>([])
   const [categories, setCategories] = useState<CategoryModel[]>([])

   useEffect(() => {
      const menuItemsUnsubs = MenuItemModel.listenToAll(setMenuItems)
      const toppingsUnsubs = ToppingModel.listenToAll(setToppings)
      const saucesUnsubs = SauceModel.listenToAll(setSauces)
      const menuItemOptionsUnsubs = MenuItemOptionModel.listenToAll(setmenuItemOptions)
      const categoriesUnsubs = CategoryModel.listenToAll(setCategories)

      return () => {
         menuItemsUnsubs()
         toppingsUnsubs()
         saucesUnsubs()
         menuItemOptionsUnsubs()
         categoriesUnsubs()
      }
   }, [])

   
   const menuModels: MenuContext = {
      menuItems,
      toppings,
      sauces,
      menuItemOptions,
      categories
   }

   return (
      <menuContext.Provider value={menuModels}>
         {children}
      </menuContext.Provider>
   )
}

export default MenuProvider
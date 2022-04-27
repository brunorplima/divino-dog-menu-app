import React, { createContext, ReactNode, useEffect, useState } from 'react'
import CategoryModel from '../../models/CategoryModel'
import FlavorModel from '../../models/FlavorModel'
import { Category, Flavor, MenuItem, Order, Sauce, Topping } from '../../models/interfaces'
import MenuItemModel from '../../models/MenuItemModel'
import OrderModel from '../../models/OrderModel'
import SauceModel from '../../models/SauceModel'
import ToppingModel from '../../models/ToppingModel'

// Context is basically a state that can be accessed by all children components
// which in this case is all children of MenuProvider

//The context type.
interface MenuContext {
   readonly menuItems: MenuItemModel[]
   readonly toppings: ToppingModel[]
   readonly sauces: SauceModel[]
   readonly flavors: FlavorModel[]
   readonly categories: CategoryModel[]
   readonly orders: OrderModel[]
}

/**
 * Using the createContext function from React we can create the context setting its type
 * and providing it with initial values. Here menu context will provide us with a Provider
 * component (menuContext.Provider) that receives "value" as prop. This value prop is basically
 * the actual values we want to give access to so all children of MenuProvider can access them.
 * See the return value of MenuProvider.
 * It's also this menuContext that will be used in the children to access the context's data,
 * that's the reason it's being exported. See in /pages/index.tsx how we use this menuContext
 * to access the data held by it.
 */
export const menuContext = createContext<MenuContext>({
   menuItems: [],
   toppings: [],
   sauces: [],
   flavors: [],
   categories: [],
   orders: []
})

/**
 * MenuProvider is a normal component that only returns logic (no UI). In here we are going to
 * manage internal state that will be the values of the context.
 */
const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   // context data comes from internal state inside of the context component
   const [menuItems, setMenuItems] = useState<MenuItemModel[]>([])
   const [toppings, setToppings] = useState<ToppingModel[]>([])
   const [sauces, setSauces] = useState<SauceModel[]>([])
   const [flavors, setFlavors] = useState<FlavorModel[]>([])
   const [categories, setCategories] = useState<CategoryModel[]>([])
   const [orders, setOrders] = useState<OrderModel[]>([])

   useEffect(() => {
      // As you saw in the Models this static function (listenToAll), it opens a real time
      // connection with the database for each model. It receives the setState function
      // so when the connection is stablished the setState will be called, setting the
      // state in this component. The listenToAll returns a function that when it's called
      // it closes the connection with the database for that specific model (collection)
      const menuItemsUnsubs = MenuItemModel.listenToAll(setMenuItems)
      const toppingsUnsubs = ToppingModel.listenToAll(setToppings)
      const saucesUnsubs = SauceModel.listenToAll(setSauces)
      const flavorsUnsubs = FlavorModel.listenToAll(setFlavors)
      const categoriesUnsubs = CategoryModel.listenToAll(setCategories)
      const ordersUnsubs = OrderModel.listenToAll(setOrders)

      // I imagine you've learned what this return in useEffects is for, but if not, useEffect when
      // returns something it should only be a function, this function is the same as
      // componentWillUnmount in class components. So when this component is removed from the rendering
      // tree we want to disconnect from the database so we don't leave an opened access to the db.
      // So what we're doing here is just making sure the db connections are closed.
      return () => {
         menuItemsUnsubs()
         toppingsUnsubs()
         saucesUnsubs()
         flavorsUnsubs()
         categoriesUnsubs()
         ordersUnsubs()
      }
   }, [])
   
   // This is the value we'll pass to the context provider.
   const menuModels: MenuContext = {
      menuItems,
      toppings,
      sauces,
      flavors,
      categories,
      orders
   }

   return (
      // All we do here is passing the values and rendering all the children
      <menuContext.Provider value={menuModels}>
         {children}
      </menuContext.Provider>
   )
}

export default MenuProvider
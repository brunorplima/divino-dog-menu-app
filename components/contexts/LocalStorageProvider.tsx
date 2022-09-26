import { any, propEq, reject } from 'ramda'
import React, { createContext, useState } from 'react'
import { ALL_KEYS, CHECKOUT_STORAGE_KEY } from '../../constants/localStorageConstants'
import { MenuItemGroup } from '../../models/interfaces'

type LocalDatabaseKey = typeof ALL_KEYS[number]

interface Props {
   readonly children: React.ReactNode
}

export interface LocalStorageContext {
   readonly menuItemGroups: MenuItemGroup[]
   readonly addMenuItemGroup: (item: MenuItemGroup) => void
   readonly removeMenuItemGroup: (id: string) => void
   readonly clearMenuItemGroups: () => void
}

export const localStorageContext = createContext<LocalStorageContext>({
   menuItemGroups: [],
   addMenuItemGroup: () => {},
   removeMenuItemGroup: () => {},
   clearMenuItemGroups: () => {},
})

function getInitialValue<T>(key: LocalDatabaseKey, defaultValue: T): T {
   if (typeof window === 'undefined' || !localStorage.getItem(key)) return defaultValue
   const value = JSON.parse(localStorage.getItem(key) || '') as T
   return value
}

const LocalStorageProvider: React.FC<Props> = ({ children }) => {
   const [menuItemGroups, setMenuItemGroups] = useState(getInitialValue<MenuItemGroup[]>(CHECKOUT_STORAGE_KEY, []))

   function addMenuItemGroup(item: MenuItemGroup) {
      const itemGroups = [...menuItemGroups, item]
      setData(CHECKOUT_STORAGE_KEY, itemGroups, setMenuItemGroups)
   }

   function removeMenuItemGroup(id: string) {
      if (!any(propEq('id', id), menuItemGroups)) return
      const itemGroups = reject(propEq('id', id), menuItemGroups)
      setData(CHECKOUT_STORAGE_KEY, itemGroups, setMenuItemGroups)
   }

   function clearMenuItemGroups() {
      setData(CHECKOUT_STORAGE_KEY, [], setMenuItemGroups)
   }


   /**
    * Private
    */

   function setData(key: LocalDatabaseKey, value: any, setFn: Function) {
      setFn(value)
      localStorage.setItem(key, JSON.stringify(value))
   }

   return (
      <localStorageContext.Provider 
         value={{
            menuItemGroups,
            addMenuItemGroup,
            removeMenuItemGroup,
            clearMenuItemGroups,
         }}
      >
         {children}
      </localStorageContext.Provider>
   )
}

export default LocalStorageProvider

import { any, propEq, reject } from 'ramda'
import React, { createContext, useState } from 'react'
import { ALL_KEYS, CHECKOUT_STORAGE_KEY } from '../../constants/localStorageConstants'
import { MenuItemGroup } from '../../models/interfaces'
import { generateID } from '../../utils/modelHelper'

type LocalDatabaseKey = typeof ALL_KEYS[number]

interface Props {
   readonly children: React.ReactNode
}

export interface LocalStorageContext {
   readonly menuItemGroups: MenuItemGroup[]
   readonly addMenuItemGroup: (item: MenuItemGroup) => void
   readonly removeMenuItemGroup: (id: string | string[]) => void
   readonly clearMenuItemGroups: () => void
   readonly addIdlessMenuItemGroup: (item: Omit<MenuItemGroup, 'id'>[]) => void
}

export const localStorageContext = createContext<LocalStorageContext>({
   menuItemGroups: [],
   addMenuItemGroup: () => {},
   removeMenuItemGroup: () => {},
   clearMenuItemGroups: () => {},
   addIdlessMenuItemGroup: () => {},
})

function getInitialValue<T>(key: LocalDatabaseKey, defaultValue: T): T {
   if (typeof window === 'undefined' || !localStorage.getItem(key)) return defaultValue
   const value = JSON.parse(localStorage.getItem(key) || '') as T
   return value
}

const LocalStorageProvider: React.FC<Props> = ({ children }) => {
   const [menuItemGroups, setMenuItemGroups] = useState(
      getInitialValue<MenuItemGroup[]>(CHECKOUT_STORAGE_KEY, [])
   )

   function addMenuItemGroup(item: MenuItemGroup) {
      const itemGroups = [...menuItemGroups, item]
      setData(CHECKOUT_STORAGE_KEY, itemGroups, setMenuItemGroups)
   }

   function removeMenuItemGroup(id: string | string[]) {
      if (typeof id === 'string') {
         if (!any(propEq('id', id), menuItemGroups)) return
         const itemGroups = reject(propEq('id', id), menuItemGroups)
         setData(CHECKOUT_STORAGE_KEY, itemGroups, setMenuItemGroups)
      } else {
         removeGroupedMenuItemGroup(id)
      }
   }

   function clearMenuItemGroups() {
      setData(CHECKOUT_STORAGE_KEY, [], setMenuItemGroups)
   }

   function addIdlessMenuItemGroup(item: Omit<MenuItemGroup, 'id'>[]) {
      const itemGroups = [...menuItemGroups]

      item.forEach((omited) => {
         const newGroup: MenuItemGroup = {
            id: generateID(),
            ...omited,
         }
         itemGroups.push(newGroup)
      })

      setData(CHECKOUT_STORAGE_KEY, itemGroups, setMenuItemGroups)
   }

   /**
    * Private
    */

   function removeGroupedMenuItemGroup(manageableList: string[]) {
      const tempMenuItem = [...menuItemGroups]
      const itemGroups: MenuItemGroup[] = []
      tempMenuItem.forEach((item) => {
         if (!manageableList.includes(item.id)) {
            itemGroups.push(item)
         }
      })
      setData(CHECKOUT_STORAGE_KEY, itemGroups, setMenuItemGroups)
   }

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
            addIdlessMenuItemGroup,
         }}
      >
         {children}
      </localStorageContext.Provider>
   )
}

export default LocalStorageProvider

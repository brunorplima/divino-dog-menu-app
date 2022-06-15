import { compose, filter, not, propEq } from "ramda"
import { MenuItemGroup } from "../models/interfaces"
import { generateID } from "./modelHelper"

export const MENU_ITEM_GROUP_KEY = 'menuItemGroups'

export const setLocalStorageItem = <T = {}>(key: string, value: T) => {
   localStorage.setItem(key, JSON.stringify(value))
}

export const deleteLocalStorageItem = (key: string) => {
   localStorage.removeItem(key)
}

/**
 * @deprecated The method should not be used
 */
export const menuItemGroups = (): MenuItemGroup[] => {
   const listString = localStorage.getItem(MENU_ITEM_GROUP_KEY)
   if (!listString) return []
   return JSON.parse(listString)
}

/**
 * @deprecated The method should not be used
 */
export const addMenuItemGroup = (menuItemGroup: Omit<MenuItemGroup, 'id'>) => {
   const list = menuItemGroups()
   const newGroup: MenuItemGroup = {
      id: generateID(),
      ...menuItemGroup
   }
   list.push(newGroup)
   setLocalStorageItem(MENU_ITEM_GROUP_KEY, list)
}

/**
 * @deprecated The method should not be used
 */
export const deleteMenuItemGroup = (id: string) => {
   const list = menuItemGroups()
   const item = filter(propEq('id', id), list)
   if (!item) return false
   const newList = filter(compose(not, propEq('id', id)), list)
   setLocalStorageItem(MENU_ITEM_GROUP_KEY, newList)
   return true
}

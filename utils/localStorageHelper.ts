import { compose, equals, filter, not, omit, propEq, uniq } from "ramda"
import { MenuItemGroup } from "../models/interfaces"
import { generateID } from "./modelHelper"

interface MenegeableStorage<T> {
   ids: string[]
   order: Omit<T, 'id'>
}

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

export const createManageableStorage = (storedData: MenuItemGroup[]) => {
   const uniqueOrders = uniq(storedData.map((order) => omit(['id'], order)))
   const idList = uniqueOrders.map((item) => {
      const idsArrays: string[] = []
      storedData.forEach((order) => {
         const l = omit(['id'], order)
         equals(item, l) && idsArrays.push(order.id)
      })
      return idsArrays
   })

   const manageable: MenegeableStorage<MenuItemGroup>[] = []
   uniqueOrders.forEach((order, idx) => {
      manageable.push({ ...{ ids: idList[idx] }, order })
   })
   return manageable
}

export const reverseManageableStorage = (objects: MenegeableStorage<MenuItemGroup>[]) => {
   const reversed: MenuItemGroup[] = []
   objects.forEach((object) =>
      object.ids.forEach((id) => {
         const obj = { ...object.order, id } as MenuItemGroup
         const ordered = Object.assign({ id: null }, obj) as MenuItemGroup
         reversed.push(ordered)
      })
   )
   return reversed
}

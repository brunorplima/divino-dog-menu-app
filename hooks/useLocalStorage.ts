import { filter } from 'ramda'
import { useState } from 'react'
import { setLocalStorageItem } from '../utils/localStorageHelper'
import { generateID } from '../utils/modelHelper'

const useLocalStorage = <T extends { id: string }>(key: string) => {
   const [storedList, setStoredList] = useState<T[]>(() => {
      if (typeof window === 'undefined') return []
      try {
         const item = localStorage.getItem(key)
         return item ? JSON.parse(item) : []
      } catch (error) {
         console.log(error)
         return []
      }
   })

   const auxConstructList = (objList: T[] | Omit<T, 'id'>[], pos: number, item: T | Omit<T, 'id'>) => {
      objList.splice(pos, 1)
      objList.splice(pos, 0, item)
   }

   const storeItem = (menuItem: Omit<T, 'id'>, idDefiner=true, position?: number) => {
      const list = [...storedList]
      const newItem = idDefiner ? { id: generateID(), ...menuItem } as T : { ...menuItem } as T
      position !== undefined ? auxConstructList(list, position, newItem) : list.push(newItem)
      setStoredList(list)
      setLocalStorageItem(key, list)
   }

   const deleteStoredItem = (id: string) => {
      const filteredList = filter((item) => item.id !== id, storedList)
      const isSuccess = filteredList.length !== storedList.length
      setStoredList(filteredList)
      setLocalStorageItem(key, filteredList)
      return isSuccess
   }

   const clearLocalStorage = () => {
      setStoredList([])
      setLocalStorageItem(key, [])
   }

   return {
      storedList,
      setStoredList,
      storeItem,
      deleteStoredItem,
      clearLocalStorage,
   }
}

export default useLocalStorage

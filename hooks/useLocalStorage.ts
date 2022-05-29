import { filter } from "ramda"
import { useState } from "react"
import { setLocalStorageItem } from "../utils/localStorageHelper"

const useLocalStorage = <T extends { id: string }>(key: string) => {
   const [storedList, setStoredList] = useState<T[]>(() => {
      if (typeof window === 'undefined') return []
      try {
         const item = localStorage.getItem(key);
         return item ? JSON.parse(item) : []
       }
       catch (error) {
         console.log(error)
         return []
       }
   })

   const deleteStoredItem = (id: string) => {
      const filteredList = filter(item => item.id !== id, storedList)
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
      deleteStoredItem,
      clearLocalStorage
   }
}

export default useLocalStorage

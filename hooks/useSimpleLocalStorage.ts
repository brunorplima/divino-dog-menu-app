import { clone, equals, reject } from "ramda"
import { useEffect, useState } from "react"
import { setLocalStorageItem } from "../utils/localStorageHelper"

const useSimpleLocalStorage = (key: string) => {
   const [storedItem, setStoredItem] = useState<string[] | null>(() => {
      if (typeof window === 'undefined') return null
      try {
         const item = localStorage.getItem(key)
         return item ? JSON.parse(item) : null
      } catch (error) {
         console.log(error)
         return null
      }
   })

   useEffect(() => {
      let syncWithStorage = () => {}
      if (typeof window !== 'undefined') {
         syncWithStorage = () => {
            const currentItem = JSON.parse(localStorage.getItem(key) ?? '[]') as string[]
            if (!equals(currentItem, storedItem)) setStoredItem(currentItem)
         }
         window.addEventListener('storage', syncWithStorage)
      }

      return () => window.removeEventListener('storage', syncWithStorage)
   }, [])

   const addItem = (value: string) => {
      const itemClone: string[] = clone(storedItem) ?? []
      itemClone.push(value)
      setStoredItem(itemClone)
      setLocalStorageItem(key, itemClone)
   }

   const removeItem = (value: string) => {
      if (storedItem?.length) {
         const withoutValue: string[] = reject(equals(value), storedItem)
         console.log(withoutValue)
      }
   }

   const setWholeItem = (value: string[]) => {
      if (storedItem?.length) {
         setStoredItem(value)
         localStorage.setItem(key, JSON.stringify(value))
      }
   }

   return { storedItem, addItem, removeItem, setWholeItem }
}

export default useSimpleLocalStorage

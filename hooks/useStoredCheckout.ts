import { equals, omit, uniq } from 'ramda'
import { useEffect, useState } from 'react'
import { generateID } from '../utils/modelHelper'

interface MenegeableStorage<T> {
   ids: string[]
   order: Omit<T, 'id'>
}

const useStoredCheckout = <T extends { id: string }>(key: string) => {
   function accessLocalStorage() {
      if (typeof window === 'undefined') return []
      try {
         const coll = localStorage.getItem(key)
         if (!coll) return []
         return JSON.parse(coll)
      } catch (error) {
         console.log(error)
         return []
      }
   }
   const [storedData, setStoredData] = useState<T[]>(accessLocalStorage())

   useEffect(() => {
      setStoredData(accessLocalStorage())
   }, [localStorage])

   const setLocalStorageObject = <T = {}>(key: string, value: T) => {
      localStorage.setItem(key, JSON.stringify(value))
   }

   const changeManageableStorage = () => {
      const uniqueOrders = uniq(storedData.map((order) => omit(['id'], order)))
      const idList = uniqueOrders.map((item) => {
         const idsArrays: string[] = []
         storedData.forEach((order) => {
            const l = omit(['id'], order)
            equals(item, l) && idsArrays.push(order.id)
         })
         return idsArrays
      })

      const manageable: MenegeableStorage<T>[] = []
      uniqueOrders.forEach((order, idx) => {
         manageable.push({ ...{ ids: idList[idx] }, order })
      })
      return manageable
   }
   const manageableStorage = changeManageableStorage()

   const reverseManageableStorage = (object: MenegeableStorage<T>[]) => {
      const reversed: T[] = []
      object.forEach((object) =>
         object.ids.forEach((id) => {
            const obj = { ...object.order, id } as T
            const ordered = Object.assign({ id: null }, obj) as T
            reversed.push(ordered)
         })
      )
      return reversed
   }

   type ActionType = 'addition' | 'subtraction' | 'remotion'
   const setLocalStorage = (object: MenegeableStorage<T>[], index: number, action: ActionType) => {
      action === 'addition' && object[index].ids.push(generateID())
      action === 'subtraction' && object[index].ids.pop()
      action === 'remotion' && object.splice(index, 1)
      const settedObject = reverseManageableStorage(object)
      setLocalStorageObject(key, settedObject)
      setStoredData(accessLocalStorage())
   }

   const clearLocalStorage = () => {
      setStoredData([])
      setLocalStorageObject(key, [])
   }

   return {
      storedData,
      manageableStorage,
      setLocalStorage,
      clearLocalStorage,
   }
}

export default useStoredCheckout

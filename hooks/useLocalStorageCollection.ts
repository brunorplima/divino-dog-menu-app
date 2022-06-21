import { clone, equals, propEq, reject } from 'ramda'
import { useEffect, useMemo, useState } from 'react'

const useLocalStorageCollection = <T extends { id: string }>(key: string) => {
   const [collection, setCollection] = useState<T[]>(() => {
      if (typeof window === 'undefined') return []
      try {
         const coll = localStorage.getItem(key)
         if (!coll) return []
         return JSON.parse(coll)
      } catch (error) {
         console.log(error)
         return []
      }
   })

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(collection))
   }, [key, collection])

   useEffect(() => {
      const syncStorage = () => {
         if (typeof window === 'undefined') return
         const collectionInStorage = JSON.parse(localStorage.getItem(key) as string)
         setCollection(collectionInStorage)
      }
      addEventListener('storage', syncStorage)

      return () => removeEventListener('storage', syncStorage)
      // const collectionInStorage = JSON.parse(localStorage.getItem(key) as string)
      // if (!equals(collectionInStorage, collection)) {
      //    setCollection(collectionInStorage)
      // }
   }, [localStorage])

   const api = useMemo(() => ({
      collection,
      addItem: (item: T) => {
         const coll = clone(collection)
         coll.push(item)
         setCollection(coll)
      },
      removeItem: (id: string) => {
         setCollection(reject(propEq('id', id), clone(collection)))
      },
      emptyCollection: () => setCollection([])
   }), [collection])

   return api
}

export default useLocalStorageCollection

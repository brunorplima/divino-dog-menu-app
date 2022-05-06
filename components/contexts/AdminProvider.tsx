import React, { createContext, useContext, useEffect, useState } from 'react'
import { equals, filter, pluck } from 'ramda'
import OrderModel from '../../models/OrderModel'
import { authContext } from './AuthProvider'
import { ORDER_ACTIVE_STATUTES, ORDER_STATUS_FINALIZADO } from '../../constants/modelsConstants'
import { collection, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase/app'

interface AdminContext {
   readonly activeOrders: OrderModel[]
   readonly latestFinalizedOrders: OrderModel[]
   readonly existingCodeNumbers: string[]
}

export const adminContext = createContext<AdminContext>({
   activeOrders: [],
   latestFinalizedOrders: [],
   existingCodeNumbers: []
})

const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [activeOrders, setActiveOrders] = useState<OrderModel[]>([])
   const [latestFinalizedOrders, setLatestFinalizedOrders] = useState<OrderModel[]>([])
   const [existingCodeNumbers, setExistingCodeNumbers] = useState<string[]>([])
   const { user } = useContext(authContext)

   useEffect(() => {
      const ordersRef = collection(db, 'orders')
      const mainQuery = query(
         ordersRef,
         where('status', 'in', ORDER_ACTIVE_STATUTES),
         orderBy('statusUpdatedAt', 'asc')
      )
      const ordersUnsubs = OrderModel.listenToQuery(mainQuery, setActiveOrders)
      const secondaryQuery = query(
         ordersRef,
         where('status','==', ORDER_STATUS_FINALIZADO),
         orderBy('statusUpdatedAt', 'desc'),
         limit(10)
      )
      const finalizedUnsubs = OrderModel.listenToQuery(secondaryQuery, setLatestFinalizedOrders)

      return () => {
         ordersUnsubs()
         finalizedUnsubs()
      }
   }, [])
   
   useEffect(() => {
      const actOrders = filter(o => ORDER_ACTIVE_STATUTES.includes(o.status), activeOrders)
      const codeNumbers = pluck('codeNumber', actOrders)
      if (!equals(codeNumbers, existingCodeNumbers)) setExistingCodeNumbers(codeNumbers)
   }, [activeOrders])

   if (!user) return <>{children}</>
   if (!user.admin && !user.master) return <>{children}</>

   return (
      <adminContext.Provider value={{ activeOrders, latestFinalizedOrders, existingCodeNumbers }}>
         {children}
      </adminContext.Provider>
   )
}

export default AdminProvider
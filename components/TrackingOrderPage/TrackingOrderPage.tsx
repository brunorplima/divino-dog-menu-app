import { collection, query, Unsubscribe, where } from 'firebase/firestore'
import moment from 'moment'
import { useRouter } from 'next/router'
import { clone, dropWhile, equals, isNil, pluck, propEq, } from 'ramda'
import React, { useEffect, useRef, useState } from 'react'
import { CURRENT_ORDERS_KEY } from '../../constants/localStorageConstants'
import { ORDER_STATUS_CANCELADO, ORDER_STATUS_FINALIZADO } from '../../constants/modelsConstants'
import { db } from '../../firebase/app'
import useSimpleLocalStorage from '../../hooks/useStoredSentOrder'
import OrderModel from '../../models/OrderModel'
import { getServerDate } from '../../utils/apiHelper'
import { deleteLocalStorageItem } from '../../utils/localStorageHelper'
import TrackOrderInfo from '../book/TrackOrderInfo'
import Dialog from '../chapter/Dialog'
import LoaderComponent from '../verse/LoaderComponent'

const TrackingOrderPage = () => {
   const router = useRouter()
   const [orders, setOrders] = useState<OrderModel[] | null>(null)
   const [dialogIsOpen, setDialogIsOpen] = useState(Boolean(router.query.justOrdered))
   const { storedItem: orderIds, setWholeItem } = useSimpleLocalStorage(CURRENT_ORDERS_KEY)
   const unsubscribe = useRef<Unsubscribe | null>(() => {})

   useEffect(() => {
      syncOrder()
      return unsubscribe.current ? unsubscribe.current : () => {}
   }, [orderIds])

   useEffect(() => {
      removeOrdersFromList()
   }, [orders])

   const syncOrder = async (): Promise<Unsubscribe> => {
      unsubscribe.current = () => {}
      if (!isNil(orderIds)) {
         const queryArray = orderIds.length > 0 ? orderIds : ['']
         const q = query(
            collection(db, 'orders'),
            where('id', 'in', queryArray),
         )
         unsubscribe.current = OrderModel.listenToQuery(q, setOrders)
      } else {
         setOrders([])
      }

      return unsubscribe.current
   }

   const removeOrdersFromList = async () => {
      const date = await getServerDate()
      let ordersClone = clone(orders)
      if (ordersClone) {
         ordersClone.forEach(order => {
            if (order.status === ORDER_STATUS_CANCELADO)
               ordersClone = dropWhile(propEq('id', order.id), ordersClone as OrderModel[])
            if (
               order.status === ORDER_STATUS_FINALIZADO &&
               moment(order.statusUpdatedAt).add(5, 'minutes').isBefore(date)
            ) {
               ordersClone = dropWhile(propEq('id', order.id), ordersClone as OrderModel[])
            }
         })
         if (!equals(ordersClone, orders)) {
            setOrders(ordersClone)
            if (ordersClone.length) setWholeItem(pluck('id', ordersClone))
            else deleteLocalStorageItem(CURRENT_ORDERS_KEY)
         }
      }
   }

   return (
      <div className='text-gray-300'>
         <div
            className='text-black py-4 px-10 text-xl mt-11'
            style={{ backgroundColor: '#dc9c36' }}
         >
            <strong>Acompanhe seu Pedido</strong>
         </div>

         {orders && orders.length > 0
            ? (
               <div
                  className='h-4/6 overflow-y-scroll pb-20'
                  style={{
                     height: '80vh',
                  }}
               >
                  {orders.map(order => (
                     <TrackOrderInfo key={order.id} order={order} />
                  ))}
               </div>
            )
            : (
               <div className='px-4 mt-16 text-2xl'>
                  Nenhum pedido foi enviado para a cozinha ainda!
               </div>
            )
         }

         <Dialog
            id='paymentReminderDialog'
            isOpen={dialogIsOpen}
            onClose={() => setDialogIsOpen(false)}
            footer={[
               {
                  label: 'Ok',
                  onClick: () => {
                     setDialogIsOpen(false)
                     router.push('/track_order')
                  }
               }
            ]}
         >
            <>Para confirmar seu pedido é preciso realizar o pagamento</>
         </Dialog>

         <LoaderComponent show={isNil(orders)}/>
      </div>
   )
}

export default TrackingOrderPage

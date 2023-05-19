import moment from 'moment'
import { filter, groupBy, isEmpty, prop, propEq } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { ORDER_ACTIVE_STATUTES, ORDER_STATUS_CONFIRMAR } from '../../../constants/modelsConstants'
import { getServerDate } from '../../../utils/apiHelper'
import OrderManagerItem from '../../chapter/OrderManagerItem'
import { adminContext } from '../../contexts/AdminProvider'
import { settingsContext } from '../../contexts/SettingsProvider'
import styles from './OrderManager.module.scss'

const MINUTE_IN_MS = 20000

const statusTitle = {
   confirmar: 'Not Confirmed',
   confirmado: 'Confirmed',
   preparando: 'Preparing',
   finalizando: 'Finalizando',
   finalizado: 'Finalized',
   cancelado: 'Cancelled',
}

const OrderManager = () => {
   const { settingsModel } = useContext(settingsContext)
   const { activeOrders, latestFinalizedOrders } = useContext(adminContext)
   const ordersByStatus = groupBy(prop('status'), activeOrders)

   useEffect(() => {
      const clearInterval = applyExpiryDateChecked()

      return clearInterval
   }, [])

   const applyExpiryDateChecked = (): () => void => {
      const expiryDateChecker = async () => {
         const dateTime = await getServerDate()
         filter(propEq('status', ORDER_STATUS_CONFIRMAR), activeOrders).forEach(async order => {
            if (!settingsModel) return
            const expiryMoment = moment(order.statusUpdatedAt).add(settingsModel.unconfirmedOrderExpiryTime, 'seconds')
            if (expiryMoment.isBefore(moment(dateTime))) await order.toStatus('cancelado')
         })
      }
      const interval = setInterval(expiryDateChecker, MINUTE_IN_MS)

      return () => clearInterval(interval)
   }

   return (
      <div className={`${styles.container} w-max px-5 flex gap-8 pt-3`}>
         {!isEmpty(ordersByStatus) &&
            ORDER_ACTIVE_STATUTES.map((status) => {
               return (
                  <div
                     key={status}
                     className='flex flex-col items-center gap-3 text-gray-300 overflow-y-scroll mb-4 border border-gray-200 rounded p-2'
                     style={{ minWidth: 280 }}
                  >
                     <h2 className='text-2xl'>{statusTitle[status]}</h2>
                     {ordersByStatus[status] &&
                        ordersByStatus[status].map((order) => (
                           <OrderManagerItem key={order.id} order={order} buttonLabel='Próximo' />
                        ))
                     }
                  </div>
               )
            })}

         <div
            className='flex flex-col items-center gap-3 text-gray-300 overflow-y-scroll mb-4 border border-gray-200 rounded p-2'
            style={{ minWidth: 280 }}
         >
            <h2 className='text-2xl'>Finalizados</h2>
            {latestFinalizedOrders.map((order) => (
               <OrderManagerItem key={order.id} order={order} />
            ))}
         </div>
      </div>
   )
}

export default OrderManager

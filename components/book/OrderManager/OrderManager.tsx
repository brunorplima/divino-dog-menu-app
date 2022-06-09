import { groupBy, isEmpty, prop } from 'ramda'
import React, { useContext } from 'react'
import { ORDER_ACTIVE_STATUTES } from '../../../constants/modelsConstants'
import OrderManagerItem from '../../chapter/OrderManagerItem'
import { adminContext } from '../../contexts/AdminProvider'
import styles from './OrderManager.module.scss'

const statusTitle = {
   confirmar: 'Não Confirmados',
   confirmado: 'Confirmados',
   preparando: 'Preparando',
   finalizando: 'Finalizando',
   finalizado: 'Finalizado',
   cancelado: 'Cancelados',
}

const OrderManager = () => {
   const { activeOrders, latestFinalizedOrders } = useContext(adminContext)
   const ordersByStatus = groupBy(prop('status'), activeOrders)

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

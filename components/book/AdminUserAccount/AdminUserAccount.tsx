import React from 'react'
import { groupBy, isEmpty, prop } from 'ramda'
import { ORDER_ACTIVE_STATUTES } from '../../../constants/modelsConstants'
import OrderModel from '../../../models/OrderModel'
import OrderManagerItem from '../../chapter/OrderManagerItem/OrderManagerItem'

interface Props {
   readonly orders: OrderModel[]
   readonly finalizedOrders: OrderModel[]
}

const statusTitle = {
   confirmar: 'Não Confirmados',
   confirmado: 'Confirmados',
   preparando: 'Preparando',
   finalizando: 'Finalizando',
   finalizado: 'Finalizado',
   cancelado: 'Cancelados'
}

const AdminUserAccount: React.FC<Props> = ({ orders, finalizedOrders }) => {
   
   const ordersByStatus = groupBy(prop('status'), orders)
   
   return (
      <div className='overflow-scroll h-screen bg-gray-800 pt-5 flex gap-5 px-2 flex-wrap'>
         {!isEmpty(ordersByStatus) &&
            ORDER_ACTIVE_STATUTES.map(status => {
               return (
                  <div key={status} className="flex flex-col items-center gap-3 text-gray-300 w-72">
                     <h2 className='text-2xl'>{statusTitle[status]}</h2>
                     {ordersByStatus[status] &&
                        ordersByStatus[status].map(order => (
                           <OrderManagerItem
                              key={order.id}
                              order={order}
                              buttonLabel='Próximo'
                           />
                        ))
                     }
                  </div>
               )
            })
         }

         <div key={status} className="flex flex-col items-center gap-3 text-gray-300 w-72">
            <h2 className='text-2xl'>Finalizados</h2>
            {
               finalizedOrders.map(order => (
                  <OrderManagerItem
                     key={order.id}
                     order={order}
                  />
               ))
            }
         </div>
         </div>
   )
}

export default AdminUserAccount
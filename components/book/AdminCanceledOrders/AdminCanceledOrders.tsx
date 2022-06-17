import React, { useContext, useMemo } from 'react'
import OrderManagerItem from '../../chapter/OrderManagerItem'
import { adminContext } from '../../contexts/AdminProvider'

const AdminCanceledOrders = () => {
   const { latestCanceledOrders } = useContext(adminContext)

   return (
      <div className='p-4'>
         <div
            className='flex flex-col items-center gap-3 text-gray-300 overflow-y-scroll mb-4 border border-gray-200 rounded p-2 max-w-sm ml-auto mr-auto'
            style={{ minWidth: 280 }}
         >
            <h2 className='text-2xl py-3'>Pedidos Cancelados</h2>
            {latestCanceledOrders.map(order => (
                  <OrderManagerItem key={order.id} order={order} />
               ))}
         </div>
      </div>
   )
}

export default AdminCanceledOrders

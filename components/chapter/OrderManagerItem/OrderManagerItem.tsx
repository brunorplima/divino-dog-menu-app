import moment from 'moment'
import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { MdDeliveryDining } from 'react-icons/md'
import OrderModel from '../../../models/OrderModel'
import PrimaryButton from '../../verse/PrimaryButton'

interface Props {
   readonly order: OrderModel
   readonly buttonLabel?: string
}

const OrderManagerItem: React.FC<Props> = ({ order, buttonLabel }) => {
   const [loading, setLoading] = useState(false)

   async function clickHandler() {
      setLoading(true)
      await order.next()
      setLoading(false)
   }

   return (
      <div className={`${loading ? 'bg-gray-200' : ''} rounded border-gray-600 border-2 min-w-full`}>
         <div className="flex justify-between items-center gap-5 border-b border-gray-700 py-3 px-4 bg-gray-700">
            <h3 className='text-2xl'>{order.codeNumber}</h3>
            <div className="color-gray-400">{`$ ${order.totalPrice.toFixed(2)}`}</div>
         </div>

         <div className="flex justify-between gap-3 py-1 px-2 border-b border-gray-700">
            <div className="flex justify-between gap-1 cursor-pointer">
               <span className='translate-y-1'><FaAngleDown /></span> Detalhes
            </div>
            
            <div className="flex justify-between gap-1">
               {order.isDelivery ? 
                  <><span className='translate-y-1 text text-lg text-green-400'><MdDeliveryDining /></span> Entrega</>
                  : ''
               }
            </div>
         </div>

         <div className="flex justify-center items-center py-2">
            {buttonLabel &&
               <PrimaryButton
                  label={buttonLabel}
                  bgColor='green'
                  clickHandler={clickHandler}
               />
            }
            {!buttonLabel &&
               <>{moment(order.statusUpdatedAt).format('DD/MM/YYYY - HH:mm:ss')}</>
            }
         </div>
      </div>
   )
}

export default OrderManagerItem
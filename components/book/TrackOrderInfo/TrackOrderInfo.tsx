import { filter, find, propEq } from 'ramda'
import React, { useContext, useMemo, useState } from 'react'
import { BiDownArrow, BiUpArrow } from 'react-icons/bi'
import { FcCheckmark } from 'react-icons/fc'
import { GoArrowSmallRight } from 'react-icons/go'
import { OrderStatus } from '../../../models/interfaces'
import OrderModel from '../../../models/OrderModel'
import { menuContext } from '../../contexts/MenuProvider'

interface Props {
   readonly order: OrderModel
}

interface StatusInfoEach {
   readonly text: string
   readonly percent: number
   readonly previousStatuses: OrderStatus[]
}

interface StatusInfo {
   readonly confirmar: StatusInfoEach
   readonly confirmado: StatusInfoEach
   readonly preparando: StatusInfoEach
   readonly finalizado: StatusInfoEach
   readonly cancelado: StatusInfoEach
}

const TrackOrderInfo: React.FC<Props> = ({ order }) => {
   const { menuItems, toppings, sauces } = useContext(menuContext)
   const [open, setOpen] = useState(false)

   const statusInfo = useMemo<StatusInfo>(() => ({
      confirmar: {
         text: 'Awaiting payment',
         percent: 0,
         previousStatuses: []
      },
      confirmado: {
         text: 'Order confirmed',
         percent: 33,
         previousStatuses: ['confirmar']
      },
      preparando: {
         text: 'Preparing order',
         percent: 66,
         previousStatuses: ['confirmar', 'confirmado']
      },
      finalizado: {
         text: 'Order\'s ready!',
         percent: 100,
         previousStatuses: ['confirmar', 'confirmado', 'preparando']
      },
      cancelado: {
         text: 'Order was cancelled',
         percent: 0,
         previousStatuses: []
      }
   }), [])

   if (!order) return null
   return (
      <div className='mt-10 px-3 rounded overflow-hidden'>
         <div className='px-4 py-3 flex gap-3' style={{ backgroundColor: 'rgb(68, 69, 73)' }}>
            <div className='flex items-end'>Order</div>
            <span className='text-3xl rounded'>{order.codeNumber}</span>
         </div>

         <div className='border-8' style={{ borderColor: 'rgb(68, 69, 73)' }}>
            <div className='px-4 py-3'>
               <div>Order status:</div>
               {statusInfo[order.status]?.previousStatuses?.map(status => (
                  <div key={JSON.stringify(status)} className='text-green-500 line-through'>
                     {statusInfo[status]?.text}
                  </div>
               ))}
               <div
                  className='text-2xl text-green-500 mb-3 flex gap-3 cursor-pointer'
                  onClick={() => {}}
               >
                  {statusInfo[order.status]?.text}
                  {order.status === 'finalizado' && <FcCheckmark />}
               </div>
               <div className='h-1 bg-gray-600 rounded' style={{ height: 6 }}>
                  <div
                     className='transition-all'
                     style={{
                        backgroundColor: 'rgb(41, 253, 83)',
                        width: `${statusInfo[order.status]?.percent}%`,
                        height: '100%'
                     }}
                  >
                  </div>
               </div>
            </div>

            <div className='mt-5 px-4 py-3'>
               <div
                  className='text-lg flex gap-2'
                  onClick={() => setOpen(!open)}
               >
                  <div>Order Details</div>
                  <span className='translate-y-2'>{open ? <BiUpArrow size={13} /> : <BiDownArrow size={13} />}</span>
               </div>
               {open && order.items.map(item => {
                  const menuItem = find(propEq('id', item.menuItemId), menuItems)
                  const extraToppings = filter(topping => item?.extraToppingIds?.includes(topping.id) || false, toppings)
                  const extraSauces = filter(sauce => item?.extraSauceIds?.includes(sauce.id) || false, sauces)
                  return (
                     <div key={item.id} className='ml-3 mb-3'>
                        <div className='flex gap-2'>
                           <span><GoArrowSmallRight size={24}/></span>
                           {menuItem?.name}
                        </div>
                        {extraToppings.length > 0 && extraToppings.map(topping => (
                           <div key={topping.id} className='ml-5'>
                              + {topping.name}
                           </div>
                        ))}
                        {extraSauces.length > 0 && extraSauces.map(sauce => (
                           <div key={sauce.id} className='ml-5'>
                              + {sauce.name}
                           </div>
                        ))}
                     </div>
                  )
               })}
               <div className='mt-4 font-bold'>Total: $ {order.totalPrice.toFixed(2)}</div>
            </div>
         </div>
      </div>
   )
}

export default TrackOrderInfo

import moment from 'moment'
import { filter, find, flatten, propEq, without } from 'ramda'
import React, { useContext, useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { MdDeliveryDining } from 'react-icons/md'
import { GoArrowSmallRight } from 'react-icons/go'
import { ORDER_STATUSES } from '../../../constants/modelsConstants'
import OrderModel from '../../../models/OrderModel'
import { capitalizeFirstLetter } from '../../../utils/dataHelper'
import { menuContext } from '../../contexts/MenuProvider'
import PrimaryButton from '../../verse/PrimaryButton'
import DropdownMenuButton from '../DropdownMenuButton'
import { settingsContext } from '../../contexts/SettingsProvider'
import styles from './OrderManagerItem.module.scss'
import PuffLoader from 'react-spinners/PuffLoader'


interface Props {
   readonly order: OrderModel
   readonly buttonLabel?: string
}

const OrderManagerItem: React.FC<Props> = ({ order, buttonLabel }) => {
   const [loading, setLoading] = useState(false)
   const { menuItems, toppings, sauces, menuItemOptions } = useContext(menuContext)
   const { settingsModel } = useContext(settingsContext)
   const [isOpen, setIsOpen] = useState(settingsModel?.orderDetailsOpenByDefault || false)

   async function clickHandler() {
      setLoading(true)
      await order.next()
      setLoading(false)
   }

   return (
      <div className={`rounded border-gray-600 border-2 min-w-full`}>
         <div className="flex justify-between items-center gap-5 border-b border-gray-700 py-3 px-4 bg-gray-700">
            <h3 className='text-2xl'>{order.codeNumber}</h3>
            <div className="color-gray-400">{`$ ${order.totalPrice.toFixed(2)}`}</div>
         </div>

         <div className='relative'>
            {loading && (
               <div
                  className='absolute w-full h-full top-0 left-0 flex justify-center items-center bg-gray-700 bg-opacity-60'
                  style={{ zIndex: 5 }}
               >
                  <PuffLoader color={'#29fd53'} loading={true} size={40} />
               </div>
            )}
            <div className="flex justify-between gap-3 py-1 px-2 border-b border-gray-700">
               <div
                  className="flex justify-between gap-1 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
               >
                  <span className='translate-y-1'>
                     {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                  Details
               </div>
               
               <div className="flex justify-between gap-1">
                  {order.isDelivery ? 
                     <><span className='translate-y-1 text text-lg text-green-400'><MdDeliveryDining /></span> Delivery</>
                     : ''
                  }
               </div>
            </div>
            
            <div className={`
               transition-all border-b border-gray-700
               ${isOpen ? styles.shown : styles.hidden} ${styles.default}
            `}>
               {order.items.map((group, idx) => {
                  const item = find(propEq('id', group.menuItemId), menuItems)
                  const extraToppings = filter(t => Boolean(group.extraToppingIds?.includes(t.id)), toppings)
                  const extraSauces = filter(s => Boolean(group.extraSauceIds?.includes(s.id)), sauces)
                  const option = find(propEq('id', group.optionId), menuItemOptions)
                  return (
                     <div className='flex gap-2 mb-1' key={group.id + idx.toString()}>
                        <div className='-translate-y-1'>
                           <GoArrowSmallRight size={28} />
                        </div>

                        <div className='text-sm'>
                           <div>{item?.name}</div>
                           {extraToppings.length > 0 && extraToppings.map((topping, idx) => (
                              <div key={topping.id + idx}>&nbsp; + {topping.name}</div>
                           ))}
                           {extraSauces.length > 0 && extraSauces.map((sauce, idx) => (
                              <div key={sauce.id + idx}>&nbsp; + {sauce.name}</div>
                           ))}
                           {option && (
                              <div>&nbsp; + {option.name}</div>
                           )}
                        </div>
                     </div>
                  )
               })}
            </div>

            <div className="flex justify-evenly items-center py-2">
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
               <DropdownMenuButton
                  buttonClassName='w-10 h-10 bg-green-500'
                  options={without([order.status], flatten(ORDER_STATUSES)).map(status => ({
                     label: capitalizeFirstLetter(status),
                     onClick: async () => {
                        setLoading(true)
                        await order.toStatus(status)
                        setLoading(false)
                     }
                  }))}
               />
            </div>
         </div>
      </div>
   )
}

export default OrderManagerItem
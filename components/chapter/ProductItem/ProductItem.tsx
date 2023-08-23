import { isNil } from 'ramda'
import React from 'react'
import { BsCheck } from 'react-icons/bs'
import { CgUnavailable } from 'react-icons/cg'
import { MdOutlineMoneyOff } from 'react-icons/md'
import { priceToString } from '../../../utils/dataHelper'
import ListItemEditDelete from '../../verse/ListItemEditDelete'
import { GoArrowSmallRight } from 'react-icons/go'

interface Props {
   readonly id: string
   readonly name: string
   readonly isAvailable: boolean
   readonly onEdit: () => void
   readonly onDelete?: () => void
   readonly onView?: Function
   readonly promotionalPrice?: number
   readonly price?: number
   readonly description?: string
}

const ProductItem: React.FC<Props> = ({
   id,
   name,
   onEdit,
   onDelete,
   description,
   promotionalPrice,
   price,
   isAvailable,
   onView = () => {}
}) => (
   <div className='flex rounded bg-gray-600 py-1 px-3 gap-3'>
      <div className='flex flex-col flex-1 cursor-pointer' onClick={() => onView()}>
         <div className='text-base font-bold text-green-600'>{name}</div>
         <div className='gap-4'>
            <div>{description}</div>
            {!!price && <div className='text-green-600'>{priceToString(price)}</div>}
            <div className='flex'>
               {isAvailable ? (
                  <>
                     <span
                        className='translate-y-1333 mt-'
                        style={{
                           transform: 'translateY(2px)',
                        }}
                     >
                        <BsCheck size={16} color='rgb(22,163,74)' />
                     </span>{' '}
                     In stock
                  </>
               ) : (
                  <>
                     <span
                        className='translate-y-1333 mt-'
                        style={{
                           transform: 'translateY(2px)',
                        }}
                     >
                        <CgUnavailable color='#f75' />
                     </span>{' '}
                     Unavailable
                  </>
               )}
            </div>
            {!isNil(promotionalPrice) && (
               <div className='flex gap-1'>
                  <span style={{ transform: 'translateY(2px)' }}><MdOutlineMoneyOff /></span>
                  <span>{`Promoção vigente`}</span>
                  <span><GoArrowSmallRight size={20}/></span>
                  <span>{priceToString(promotionalPrice)}</span>
               </div>
            )}
         </div>
      </div>
      <ListItemEditDelete
         modalId={`itemEditDelete-${id}`}
         itemName={name}
         onEdit={onEdit}
         onDelete={onDelete}
      />
   </div>
)

export default ProductItem

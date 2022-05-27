import React from 'react'
import { BsCheck } from 'react-icons/bs'
import { CgUnavailable } from 'react-icons/cg'
import { priceToString } from '../../../utils/dataHelper'
import ListItemEditDelete from '../../verse/ListItemEditDelete'

interface Props {
   readonly name: string
   readonly isAvailable: boolean
   readonly onEdit: () => void
   readonly onView?: Function
   readonly price?: number
   readonly img?: string
   readonly description?: string
}

const ProductItem: React.FC<Props> = ({
   img,
   name,
   onEdit,
   description,
   price,
   isAvailable,
   onView = () => {}
}) => (
   <div className='flex rounded bg-gray-600 py-1 px-3 gap-3'>
      <div className='flex flex-col flex-1 cursor-pointer' onClick={() => onView()}>
         <div className='text-base font-bold text-green-600'>{name}</div>
         <div className='gap-4'>
            {!!img && (
               <div className='w-28 mr-4 flex items-center float-left'>
                  <img alt={name} src={img} />
               </div>
            )}
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
                     Em estoque
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
                     Indisponível
                  </>
               )}
            </div>
         </div>
      </div>
      <ListItemEditDelete onEdit={onEdit} />
   </div>
)

export default ProductItem

import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { BsCheck } from 'react-icons/bs'
import { CgDetailsMore, CgUnavailable } from 'react-icons/cg'
import { priceToString } from '../../../utils/dataHelper'

interface Props {
   readonly name: string
   readonly isAvailable: boolean
   readonly price?: number
   readonly img?: string
   readonly description?: string
}

 const ProductItem: React.FC<Props> = ({ img, name, description, price, isAvailable }) => {
   return (
      <div className='flex rounded bg-gray-600 py-1 px-3 gap-3'>
         {!!img && (
            <div>
               <img alt={name} src={img} />
            </div>
         )}
         <div className='flex flex-col'>
            <div className='text-base font-bold text-green-600'>{name}</div>
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
         <div className='flex-1'></div>
         <div className='flex flex-col justify-evenly gap-2'>
            <div className='grid place-content-center rounded-full bg-green-700 p-1 cursor-pointer hover:bg-green-600'>
               <span>
                  <CgDetailsMore size={20} />
               </span>
            </div>
            <div className='grid place-content-center rounded-full bg-green-700 p-1 cursor-pointer hover:bg-green-600'>
               <span>
                  <BiEditAlt size={20} />
               </span>
            </div>
         </div>
      </div>
   )
}

export default ProductItem

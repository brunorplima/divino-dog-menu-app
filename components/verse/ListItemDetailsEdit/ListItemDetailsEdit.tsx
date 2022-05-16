import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { CgDetailsMore } from 'react-icons/cg'

interface Props {
   readonly horizontal?: boolean
}

const ListItemDetailsEdit: React.FC<Props> = ({ horizontal = false }) => {
   return (
      <div className={`flex ${horizontal ? '' : 'flex-col'} justify-evenly gap-2`}>
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
   )
}

export default ListItemDetailsEdit

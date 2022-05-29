import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { RiDeleteBin5Line } from 'react-icons/ri'

interface Props {
   readonly onEdit: Function
   readonly onDelete?: Function
   readonly horizontal?: boolean
}

const ListItemEditDelete: React.FC<Props> = ({ onEdit, onDelete = () => {}, horizontal = false }) => {
   return (
      <div className={`flex ${horizontal ? '' : 'flex-col'} justify-evenly gap-2`}>
         <div
            className='grid place-content-center rounded-full bg-green-700 p-1 cursor-pointer hover:bg-green-600'
            onClick={() => onEdit()}
         >
            <span>
               <BiEditAlt size={20} />
            </span>
         </div>
         <div
            className='grid place-content-center rounded-full bg-green-700 p-1 cursor-pointer hover:bg-green-600'
            onClick={() => onDelete()}
         >
            <span>
               <RiDeleteBin5Line size={20} />
            </span>
         </div>
      </div>
   )
}

export default ListItemEditDelete

import React, { useState } from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { generateID } from '../../../utils/modelHelper'
import Dialog from '../../chapter/Dialog'

interface Props {
   readonly onEdit: Function
   readonly itemName: string
   readonly modalId?: string
   readonly onDelete?: Function
   readonly horizontal?: boolean
}

const ListItemEditDelete: React.FC<Props> = ({ onEdit, itemName, modalId = generateID(), onDelete = () => {}, horizontal = false }) => {
   const [isOpen, setIsOpen] = useState(false)

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
            onClick={() => setIsOpen(true)}
         >
            <span>
               <RiDeleteBin5Line size={20} />
            </span>
         </div>

         <Dialog
            id={modalId}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            footer={[
               {
                  label: 'Cancelar',
                  onClick: () => setIsOpen(false)
               },
               {
                  label: 'Sim',
                  onClick: () => onDelete()
               }
            ]}
         >
            Tem certeza que quer deletar {itemName}?
         </Dialog>
      </div>
   )
}

export default ListItemEditDelete

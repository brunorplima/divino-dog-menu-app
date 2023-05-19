import React, { useState } from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { MdDeleteOutline } from 'react-icons/md'
import { generateID } from '../../../utils/modelHelper'
import { ViewEditCreate } from '../../book/AdminProductsSection/AdminProductsSection'
import Dialog from '../../chapter/Dialog'
import PrimaryButton from '../PrimaryButton'

interface Props {
   readonly action: ViewEditCreate | undefined
   readonly setMode: (action?: ViewEditCreate) => void
   readonly onDelete?: () => Promise<void>
}

const ModelEditDeleteController:React.FC<Props> = ({ action, setMode, onDelete }) => {
   const [isOpen, setIsOpen] = useState(false)

   return (
      <div className='flex gap-3 mb-6'>
         {action !== 'view' && (
            <PrimaryButton
               label='Cancel'
               icon={<IoMdArrowRoundBack />}
               clickHandler={() => {
                  if (action === 'create') setMode()
                  else setMode('view')
               }}
            />
         )}
         {action === 'view' && (
               <PrimaryButton
                  label='Edit'
                  icon={<BiEditAlt />}
                  clickHandler={() => setMode('edit')}
               />
            )
         }
         {onDelete && action !== 'create' && (
            <>
               <PrimaryButton
                  label='Delete'
                  icon={<MdDeleteOutline />}
                  clickHandler={() => setIsOpen(true)}
               />
               <Dialog
                  id={generateID()}
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  footer={[
                     {
                        label: 'Cancel',
                        onClick: () => setIsOpen(false)
                     },
                     {
                        label: 'Yes',
                        onClick: async () => await onDelete()
                     }
                  ]}
               >
                  Are you sure you want to delete this item?
               </Dialog>
            </>
         )}
      </div>
   )
}

export default ModelEditDeleteController

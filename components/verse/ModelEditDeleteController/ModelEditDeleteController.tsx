import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { MdDeleteOutline } from 'react-icons/md'
import { ViewEditCreate } from '../../book/AdminProductsSection/AdminProductsSection'
import PrimaryButton from '../PrimaryButton'

interface Props {
   readonly action: ViewEditCreate | undefined
   readonly setMode: (action?: ViewEditCreate) => void
   readonly onDelete?: () => Promise<void>
}

const ModelEditDeleteController:React.FC<Props> = ({ action, setMode, onDelete }) => {
  return (
   <div className='flex gap-3 mb-6'>
      {action === 'edit' || action === 'create' && (
         <PrimaryButton
            label='Cancelar'
            icon={<IoMdArrowRoundBack />}
            clickHandler={() => {
               if (action === 'create') setMode()
               else if (action === 'edit') setMode('view')
            }}
         />
      )}
      {action === 'view' && (
            <PrimaryButton
               label='Editar'
               icon={<BiEditAlt />}
               clickHandler={() => setMode('edit')}
            />
         )
      }
      {onDelete && action !== 'create' && (
         <PrimaryButton
            label='Deletar'
            icon={<MdDeleteOutline />}
            clickHandler={async () => await onDelete()}
         />
      )}
   </div>
  )
}

export default ModelEditDeleteController

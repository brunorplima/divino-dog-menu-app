import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { MdDeleteOutline } from 'react-icons/md'
import PrimaryButton from '../PrimaryButton'

interface Props {
   readonly isEditMode: boolean
   readonly setEditMode: (isEdit: boolean) => void
}

const ModelEditDeleteController:React.FC<Props> = ({ isEditMode, setEditMode }) => {
  return (
   <div className='flex gap-3 mb-6'>
      {
         isEditMode
         ? (
            <PrimaryButton
               label='Cancelar'
               icon={<IoMdArrowRoundBack />}
               clickHandler={() => setEditMode(false)}
            />
         )
         : (
            <PrimaryButton
               label='Editar'
               icon={<BiEditAlt />}
               clickHandler={() => setEditMode(true)}
            />
         )
      }
      <PrimaryButton
         label='Deletar'
         icon={<MdDeleteOutline />}
      />
   </div>
  )
}

export default ModelEditDeleteController

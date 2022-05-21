import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import CategoryModel from '../../../models/CategoryModel'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'
import PrimaryButton from '../../verse/PrimaryButton'

interface Props {
   readonly item: CategoryModel
   readonly associatedMenuItems: string
   readonly setEditMode: (isEdit: boolean) => void
}

const AdminCategoriesView: React.FC<Props> = ({ item, associatedMenuItems, setEditMode }) => {
  return (
      <div className='text-white'>
         <div className='flex gap-3 mb-6'>
            <PrimaryButton
               label='Editar'
               icon={BiEditAlt}
               clickHandler={() => setEditMode(true)}
            />
            <PrimaryButton
               label='Deletar'
               icon={MdDeleteOutline}
               clickHandler={setEditMode}
            />
         </div>
         <h2 className='text-xl text-green-500 mb-6'>
            Detalhes
         </h2>
         
         <ModelStandardFieldInfo
            label='Ordem de lista'
            info={item.listOrder}
         />
         {
            associatedMenuItems && (
               <ModelStandardFieldInfo
                  label='Items dessa categoria'
                  info={associatedMenuItems}
                  col
               />
            )
         }
      </div>
   )
}

export default AdminCategoriesView
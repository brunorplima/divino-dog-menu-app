import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import CategoryModel from '../../../models/CategoryModel'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'
import PrimaryButton from '../../verse/PrimaryButton'

interface Props {
   readonly item: CategoryModel
   readonly associatedMenuItems: string
}

const AdminCategoriesView: React.FC<Props> = ({ item, associatedMenuItems }) => {
  return (
      <div className='text-white'>
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
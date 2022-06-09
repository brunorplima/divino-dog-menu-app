import React from 'react'
import CategoryModel from '../../../models/CategoryModel'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'

interface Props {
   readonly item: CategoryModel
   readonly associatedMenuItems: string | JSX.Element
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
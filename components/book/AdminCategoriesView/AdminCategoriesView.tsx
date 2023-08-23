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
            Details
         </h2>
         
         <ModelStandardFieldInfo
            label="List's order"
            info={item.listOrder}
         />
         {
            associatedMenuItems && (
               <ModelStandardFieldInfo
                  label='Items on this category'
                  info={associatedMenuItems}
                  col
               />
            )
         }
      </div>
   )
}

export default AdminCategoriesView
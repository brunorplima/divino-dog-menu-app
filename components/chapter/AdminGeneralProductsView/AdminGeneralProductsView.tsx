import { has } from 'ramda'
import React from 'react'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { priceToString } from '../../../utils/dataHelper'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'

interface Props {
   readonly item: ToppingModel | SauceModel | MenuItemOptionModel
   readonly associatedMenuItems: string
   readonly hasCanBeExtra?: boolean
}

const AdminGeneralProductsView: React.FC<Props> = ({ item, associatedMenuItems, hasCanBeExtra }) => {
  return (
      <div className='text-white'>
         <h2 className='text-xl text-green-500 mb-6'>
            Details
         </h2>
         
         <ModelStandardFieldInfo
            label='Price'
            info={item.price ? priceToString(item.price) : 'No price'}
         />
         <ModelStandardFieldInfo
            label='In stock'
            info={item.isAvailable ? 'Sim' : 'Não'}
         />
         {hasCanBeExtra && (
            <ModelStandardFieldInfo
               label='User can add'
               info={(item as ToppingModel | SauceModel).canBeExtra ? 'Yes' : 'No'}
            />
         )}
         {
            associatedMenuItems && (
               <ModelStandardFieldInfo
                  label='Used by'
                  info={associatedMenuItems}
                  col
               />
            )
         }
      </div>
   )
}

export default AdminGeneralProductsView
import React from 'react'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { priceToString } from '../../../utils/dataHelper'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'

interface Props {
   readonly item: ToppingModel | SauceModel | MenuItemOptionModel
   readonly associatedMenuItems: string
}

const AdminGeneralProductsView: React.FC<Props> = ({ item, associatedMenuItems }) => {
  return (
      <div className='text-white'>
         <h2 className='text-xl text-green-500 mb-6'>
            Detalhes
         </h2>
         
         <ModelStandardFieldInfo
            label='Preço'
            info={item.price ? priceToString(item.price) : 'Sem preço'}
         />
         <ModelStandardFieldInfo
            label='Em estoque'
            info={item.isAvailable ? 'Sim' : 'Não'}
         />
         {
            associatedMenuItems && (
               <ModelStandardFieldInfo
                  label='Usado por'
                  info={associatedMenuItems}
                  col
               />
            )
         }
      </div>
   )
}

export default AdminGeneralProductsView
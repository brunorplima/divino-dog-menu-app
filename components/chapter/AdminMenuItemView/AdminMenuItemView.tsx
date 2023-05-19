import moment from 'moment'
import { filter, find, pluck, join, propEq, isNil } from 'ramda'
import React, { useContext, useEffect, useMemo } from 'react'
import CategoryModel from '../../../models/CategoryModel'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import MenuItemModel from '../../../models/MenuItemModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { priceToString } from '../../../utils/dataHelper'
import { menuContext } from '../../contexts/MenuProvider'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'

interface Props {
   readonly item: MenuItemModel
}

const AdminMenuItemView: React.FC<Props> = ({ item }) => {
   const { categories, toppings, sauces, menuItemOptions } = useContext(menuContext)

   useEffect(() => {
      if (item.promoPrice && !item.hasValidPromotion()) item.dissoc(['promoPrice'])
   }, [item])

   const category = useMemo(() => {
      return find<CategoryModel>(propEq('id', item?.categoryId), categories)
   }, [item])

   function getListString<T extends { name: string, id: string }>(list: T[], whitelist: string[]) {
      const models = filter(m => whitelist.includes(m.id) || false, list)
      return join(', ', pluck('name', models))
   }

   return (
      <div className='text-white'>
         <h2 className='text-xl text-green-500 mb-6'>
            Details
         </h2>
         {
            item.img && (
               <div
                  className='h-24 mb-4'
                  style={{
                     backgroundImage: `url("${item.img}")`,
                     backgroundSize: '200px',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center'
                  }}
               ></div>
            )
         }
         {
            item.description && (
               <ModelStandardFieldInfo
                  label='Description'
                  info={item.description || ''}
                  col
               />
            )
         }
         <ModelStandardFieldInfo
            label='Price'
            info={priceToString(item.price)}
         />
         <ModelStandardFieldInfo
            label='In stock'
            info={item.isAvailable ? 'Sim' : 'Não'}
         />
         <ModelStandardFieldInfo
            label='Category'
            info={category?.name || ''}
         />
         <ModelStandardFieldInfo
            label="Category's order"
            info={item.listOrder}
         />
         {
            item.toppingIds && item.toppingIds.length > 0 && (
               <ModelStandardFieldInfo
                  label='Toppings'
                  info={getListString<ToppingModel>(toppings, item.toppingIds)}
                  col
               />
            )
         }
         {
            item.sauceIds && item.sauceIds.length > 0 && (
               <ModelStandardFieldInfo
                  label='Sauces'
                  info={getListString<SauceModel>(sauces, item.sauceIds)}
                  col
               />
            )
         }
         {
            item.optionIds && item.optionIds.length > 0 && (
               <ModelStandardFieldInfo
                  label='Options'
                  info={getListString<MenuItemOptionModel>(menuItemOptions, item.optionIds)}
                  col
               />
            )
         }
         {
            item.promoPrice && item.hasValidPromotion() && (
               <ModelStandardFieldInfo
                  label='Current promotion'
                  info={(
                     <div className='py-2'>
                        <div className="border-l-4 border-gray-400 px-4 py-1">
                           Expires at: {moment(item.promoPrice.dateLimit).format('MM-DD-YYYY')}
                        </div>
                        {!isNil(item.promoPrice.price) &&
                           <div className='border-l-4 border-gray-400 px-4 py-1'>
                              {priceToString(item.promoPrice.price)}
                           </div>
                        }
                     </div>
                  )}
                  col
               />
            )
         }
         <ModelStandardFieldInfo
            label='Available weekdays'
            info={item.weekDays?.length ? item.availableDaysToString() : 'Everyday'}
            col
         />
      </div>
   )
}

export default AdminMenuItemView

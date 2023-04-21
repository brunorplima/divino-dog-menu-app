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
            Detalhes
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
                  label='Descrição'
                  info={item.description || ''}
                  col
               />
            )
         }
         <ModelStandardFieldInfo
            label='Preço'
            info={priceToString(item.price)}
         />
         <ModelStandardFieldInfo
            label='Em estoque'
            info={item.isAvailable ? 'Sim' : 'Não'}
         />
         <ModelStandardFieldInfo
            label='Categoria'
            info={category?.name || ''}
         />
         <ModelStandardFieldInfo
            label='Ordem na categoria'
            info={item.listOrder}
         />
         {
            item.toppingIds && item.toppingIds.length > 0 && (
               <ModelStandardFieldInfo
                  label='Ingredientes'
                  info={getListString<ToppingModel>(toppings, item.toppingIds)}
                  col
               />
            )
         }
         {
            item.sauceIds && item.sauceIds.length > 0 && (
               <ModelStandardFieldInfo
                  label='Molhos'
                  info={getListString<SauceModel>(sauces, item.sauceIds)}
                  col
               />
            )
         }
         {
            item.optionIds && item.optionIds.length > 0 && (
               <ModelStandardFieldInfo
                  label='Opções'
                  info={getListString<MenuItemOptionModel>(menuItemOptions, item.optionIds)}
                  col
               />
            )
         }
         {
            item.promoPrice && item.hasValidPromotion() && (
               <ModelStandardFieldInfo
                  label='Promoção em vigor'
                  info={(
                     <div className='py-2'>
                        <div className="border-l-4 border-gray-400 px-4 py-1">
                           Validade: {moment(item.promoPrice.dateLimit).format('DD/MM/YYYY')}
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
      </div>
   )
}

export default AdminMenuItemView

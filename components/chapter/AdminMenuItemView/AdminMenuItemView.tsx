import moment from 'moment'
import { filter, find, pluck, join, propEq } from 'ramda'
import React, { useContext, useMemo } from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import CategoryModel from '../../../models/CategoryModel'
import FlavorModel from '../../../models/FlavorModel'
import MenuItemModel from '../../../models/MenuItemModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { priceToString } from '../../../utils/dataHelper'
import { menuContext } from '../../contexts/MenuProvider'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'
import PrimaryButton from '../../verse/PrimaryButton'

interface Props {
   readonly item: MenuItemModel
   readonly setEditMode: (isEdit: boolean) => void
}

const AdminMenuItemView: React.FC<Props> = ({ item, setEditMode }) => {
   const { categories, toppings, sauces, flavors } = useContext(menuContext)

   const category = useMemo(() => {
      return find<CategoryModel>(propEq('id', item.categoryId), categories)
   }, [item])

   function getListString<T extends { name: string, id: string }>(list: T[], whitelist: string[]) {
      const models = filter(m => whitelist.includes(m.id) || false, list)
      return join(', ', pluck('name', models))
   }

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
            item.toppingIds && item.toppingIds.length && (
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
            item.uniqOptions && item.uniqOptions.length > 0 && (
               <ModelStandardFieldInfo
                  label='Opções'
                  info={join(', ', item.uniqOptions)}
                  col
               />
            )
         }
         {
            item.flavorIds && item.flavorIds.length > 0 && (
               <ModelStandardFieldInfo
                  label='Sabores'
                  info={getListString<FlavorModel>(flavors, item.flavorIds)}
                  col
               />
            )
         }
         {
            item.promoPrice && (
               <ModelStandardFieldInfo
                  label='Promoção em vigor'
                  info={(
                     <div className='py-2'>
                        <div className="border-l-4 border-gray-400 px-4 py-1">
                           Validade: {moment(item.promoPrice.dateLimit).format('L')}
                        </div>
                        <div className='border-l-4 border-gray-400 px-4 py-1'>{priceToString(item.promoPrice.price)}</div>
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

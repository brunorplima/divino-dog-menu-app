import Image from 'next/image'
import { useRouter } from 'next/router'
import { drop, equals, filter, find, head, isEmpty, omit, pick, pluck, propEq, sum } from 'ramda'
import React, { useContext, useMemo } from 'react'
import { FaWindowClose } from 'react-icons/fa'
import useLocalStorageCollection from '../../hooks/useLocalStorageCollection'
import useSimpleLocalStorage from '../../hooks/useSimpleLocalStorage'
import { MenuItemGroup } from '../../models/interfaces'
import MenuItemModel from '../../models/MenuItemModel'
import OrderModel from '../../models/OrderModel'
import SauceModel from '../../models/SauceModel'
import ToppingModel from '../../models/ToppingModel'
import { fotmatPrice } from '../../utils/dataHelper'
import { MENU_ITEM_GROUP_KEY } from '../../utils/localStorageHelper'
import { menuContext } from '../contexts/MenuProvider'
import PrimaryButton from '../verse/PrimaryButton'
import { CURRENT_ORDERS_KEY } from './sendOrderData'

interface MergedItem extends Omit<MenuItemGroup, 'id'> {
   ids: string[]
}

const OrderPageV2 = () => {
   const { menuItems, toppings, sauces } = useContext(menuContext)
   const { collection, removeItem, emptyCollection } = useLocalStorageCollection<MenuItemGroup>(MENU_ITEM_GROUP_KEY) ;console.log(collection)
   const { addItem } = useSimpleLocalStorage(CURRENT_ORDERS_KEY)
   const router = useRouter()

   const list = useMemo(() => {
      const theList: MergedItem[] = []
      collection.forEach(item => {
         if (isEmpty(theList)) {
            theList.push({ ids: [item.id], ...omit(['id'], item) })
         }
         else {
            let matched = false
            theList.forEach(el => {
               if (equals(omit(['ids'], el), omit(['id'], item))) {
                  el.ids.push(item.id)
                  matched = true
               }
            })
            if (!matched) theList.push({ ids: [item.id], ...omit(['id'], item) })
         }
      })
      return theList
   }, [collection])

   const total = useMemo(() => {
      return sum(pluck('subTotal', collection))
   }, [collection])

   const getItem = <T extends { id: string }>(id: string | string[], models: T[]) => {
      if (Array.isArray(id)) return filter(model => id.includes(model.id), models)
      else return find(propEq('id', id), models)
   }

   const deleteItem = (ids: string[]) => {
      ids.forEach(id => removeItem(id))
   }

   const linkToItemsPage = (menuItem: Omit<MenuItemGroup, 'id'>, quant: number): string => {
      const d = menuItems.find((item) => menuItem.menuItemId === item.id)
      const textCategoryId = d ? d.categoryId : ''

      const is = collection.filter((order) => equals(omit(['id'], order), menuItem))
      const ids = is.map((order) => order.id).join('-')
      const textIds = `&itemsIds=${ids}` // this variable holds the ids of the order that holds equals items

      const textQuantity = `&quantity=${quant}`

      const t = menuItem.extraToppingIds ? menuItem.extraToppingIds.join('-') : ''
      const s = menuItem.extraSauceIds ? menuItem.extraSauceIds.join('-') : ''
      const textBoxes = `${t}-${s}` === '-' ? '' : `&boxes=${t}-${s}`

      return `/item?itemId=${menuItem.menuItemId}&catId=${textCategoryId}${textIds}${textQuantity}${textBoxes}`
   }

   return (
      <div className='font-medium flex flex-col'
         style={{ height: 'calc(100vh - 130px)' }}
      >
         <div
            className='w-screen my-12 font-semibold text-xl bg-green-400 py-4 px-12'
            style={{ backgroundColor: '#29fd53' }}   
         >
            Seu Pedido
         </div>
         {list.length > 0 ? (
            <div className='flex flex-col flex-1 gap-1 mb-24 max-h'>
               {list.map(item => {
                  const menuItem = getItem<MenuItemModel>(item.menuItemId, menuItems) as MenuItemModel
                  const assocToppings = getItem<ToppingModel>(item.extraToppingIds || [], toppings) as ToppingModel[] ;console.log(assocToppings)
                  const assocSauces = getItem<SauceModel>(item.extraSauceIds || [], sauces) as SauceModel[]
                  return (
                     <div
                        key={item.ids.join(',')}
                        className='w-screen flex gap-3 p-4 text-white'
                        style={{ backgroundColor: '#444549' }}
                     >
                        <div>
                           {item.ids.length}x
                        </div>
                        <div className='flex-1'>
                           <div className='font-bold'>{menuItem?.name}</div>
                           {(assocToppings.length || assocSauces.length) ? (
                              <div className='text-gray-300 ml-2'>
                                 <div className='font-bold'>Adicionais</div>
                                 {assocToppings && assocToppings.length > 0 && assocToppings.map(topping => (
                                    <div key={topping.id} className='text-sm'>{topping.name}</div>
                                 ))}
                                 {assocSauces.length > 0 && assocToppings.map(sauce => (
                                    <div key={sauce.id}>{sauce.name}</div>
                                 ))}
                              </div>
                           ) : null}
                        </div>
                        <div className='flex gap-2'>
                           <div className='text-right'>{fotmatPrice(item.subTotal * item.ids.length)}</div>
                           <div
                              className={`relative`}
                              onClick={() => deleteItem(item.ids)}
                           >
                              <FaWindowClose size={20} />
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
         ) : (
            <div className='flex-1 p-10 text-white text-2xl flex flex-col items-center'>
               <div className='text-center mb-10'>Nenhum item foi selecionado ainda.</div>
               <img src='/empty-box.png' className='w-32'/>
            </div>
         )}
         <div
            className='flex justify-between py-3 px-8 fixed w-screen bottom-10'
            style={{ backgroundColor: '#444549' }}
         >
            <PrimaryButton
               label='Confirmar Pedido'
               className='font-bold'
               style={
                  collection.length !== 0
                     ? { background: '#29fd53', color: 'black', padding: '0.70rem' }
                     : { background: 'lightgray', color: 'gray', padding: '0.70rem' }
               }
               disabled={collection.length === 0}
               clickHandler={async () => {
                  const order = new OrderModel({
                     items: collection,
                     isDelivery: false
                  })
                  try {
                     order.save()
                     addItem(order.id)
                     router.push('/track_order?justOrdered=true')
                     emptyCollection()
                  }
                  catch (err: any) {
                     console.log(err.message)
                  }
               }}
            />
            <div className='font-bold text-white'>
               {fotmatPrice(total)}
            </div>
         </div>
      </div>
   )
}

export default OrderPageV2
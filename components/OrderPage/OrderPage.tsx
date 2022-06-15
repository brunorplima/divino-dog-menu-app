import React, { useContext } from 'react'
import { addMenuItemGroup, MENU_ITEM_GROUP_KEY } from '../../utils/localStorageHelper'
import { fotmatPrice } from '../../utils/dataHelper'
import { menuContext } from '../contexts/MenuProvider'
import style from './OrderPage.module.scss'
import { MenuItemGroup } from '../../models/interfaces'
import { FaWindowClose } from 'react-icons/fa'
import Link from 'next/link'
import { equals, omit, uniq } from 'ramda'
import useLocalStorage from '../../hooks/useLocalStorage'
import sendOrderData, { CURRENT_ORDERS_KEY } from './sendOrderData'
import useSimpleLocalStorage from '../../hooks/useSimpleLocalStorage'
import { useRouter } from 'next/router'

export default function OrderPage() {
   let totalBill = 0

   const router = useRouter()
   const { menuItems, toppings, sauces } = useContext(menuContext)
   const { storedList, setStoredList, clearLocalStorage } = useLocalStorage<MenuItemGroup>(MENU_ITEM_GROUP_KEY)
   const { addItem } = useSimpleLocalStorage(CURRENT_ORDERS_KEY)

   const idlessOrders = storedList.map((order) => omit(['id'], order)) // removing id property to group equal orders together
   const uniqueOrders = uniq(idlessOrders) // unique equal orders
   // counting amount of each unique equal order
   const indexes = idlessOrders.map((idless) =>
      uniqueOrders.findIndex((unique) => equals(unique, idless))
   )
   const counter = uniq(indexes).map((u) => indexes.filter((ind) => ind === u).length)

   const findItemName = <T extends { id: string; name: string }>(
      objArray: T[],
      elem: MenuItemGroup | string
   ): string => {
      const comparator = typeof elem === 'string' ? elem : elem.menuItemId
      const res = objArray.find((a) => a.id === comparator)
      return res !== undefined ? res.name : `Absent Model: ${comparator}`
   }

   const deleteOrder = (o: Omit<MenuItemGroup, 'id'>) => {
      let newOrder: MenuItemGroup[] = []
      let deleteIds: string[] = []
      storedList.forEach((order) => {
         const tester = equals(o, omit(['id'], order))
         !tester && newOrder.push(order)
         tester && deleteIds.push(order.id)
      })

      clearLocalStorage()
      newOrder.forEach((order) => addMenuItemGroup(omit(['id'], order)))
      setStoredList(newOrder)
   }

   const linkToItemsPage = (menuItem: Omit<MenuItemGroup, 'id'>, quant: number): string => {
      const d = menuItems.find((item) => menuItem.menuItemId === item.id)
      const textCategoryId = d ? d.categoryId : ''

      const is = storedList.filter((order) => equals(omit(['id'], order), menuItem))
      const ids = is.map((order) => order.id).join('-')
      const textIds = `&itemsIds=${ids}` // this variable holds the ids of the order that holds equals items

      const textQuantity = `&quantity=${quant}`

      const t = menuItem.extraToppingIds ? menuItem.extraToppingIds.join('-') : ''
      const s = menuItem.extraSauceIds ? menuItem.extraSauceIds.join('-') : ''
      const textBoxes = `${t}-${s}` === '-' ? '' : `&boxes=${t}-${s}`

      return `/item?itemId=${menuItem.menuItemId}&catId=${textCategoryId}${textIds}${textQuantity}${textBoxes}`
   }

   return (
      <div className={`${style.orderPageOuterDiv} ${style.hideScroller} font-medium my-12 mb-52`}>
         <div
            className={`${style.topTitle} ${style.hideScroller} relative font-semibold text-xl my-12 w-screen`}
         >
            <div className={`${style.hideScroller} text-left`}>Seu Pedido</div>
         </div>
         {storedList.length === 0 && (
            <div className='text-4xl m-6'>
               Você não selecionou nenhum item ainda.
            </div>
         )}
         {uniqueOrders.map((e, idx) => (
            <div key={e.menuItemId + String(idx)} id={String(idx)}>
               <div className={`${style.singleItem} relative grid gap-3 my-1 w-screen`}>
                  <div>{counter[idx]}x</div>
                  <Link href={linkToItemsPage(e, counter[idx])} passHref>
                     <div>
                        <div className='font-semibold'>{findItemName(menuItems, e.menuItemId)}</div>
                        <div className={`${style.itemInfo}`}>
                           {!!e.extraSauceIds && e.extraSauceIds.length !== 0 && (
                              <>
                                 <div className='font-semibold text-base'>Molhos</div>
                                 {e.extraSauceIds.map((id) => (
                                    <div key={id}>{findItemName(sauces, id)}</div>
                                 ))}
                              </>
                           )}
                           {!!e.extraToppingIds && e.extraToppingIds.length !== 0 && (
                              <>
                                 <div className='font-semibold text-base'>Adicionais</div>
                                 {e.extraToppingIds.map((id) => (
                                    <div key={id}>{findItemName(toppings, id)}</div>
                                 ))}
                              </>
                           )}
                        </div>
                     </div>
                  </Link>
                  <div className='text-right'>{fotmatPrice(e.subTotal * counter[idx])}</div>
                  <div
                     id={`o-${String(idx)}`}
                     className={`relative`}
                     onClick={() => deleteOrder(e)}
                  >
                     <FaWindowClose size={20} />
                  </div>
               </div>
               <span className='hidden'>{(totalBill += e.subTotal * counter[idx])}</span>
            </div>
         ))}
         <br />
         <br />
         <br />
         <br />
         <br />
         <br />
         <div
            className='fixed flex justify-between gap-3 font-semibold mt-12'
            style={{
               background: '#444549',
               borderTop: '5px solid #222327',
               padding: '1rem 3rem',
               left: '-1rem',
               right: '-1rem',
               bottom: '7rem',
            }}
         >
            <div className='text-left'>
               <button
                  className='rounded-lg font-semibold'
                  style={
                     storedList.length !== 0
                        ? { background: '#29fd53', color: 'black', padding: '0.70rem' }
                        : { background: 'lightgray', color: 'gray', padding: '0.70rem' }
                  }
                  disabled={storedList.length === 0}
                  onClick={() => sendOrderData(storedList, (orderId: string) => {
                     addItem(orderId)
                     router.push('/track_order?justOrdered=true')
                     clearLocalStorage()
                  })}
               >
                  Confirmar Pedido
               </button>
            </div>
            <div className='text-right'>{fotmatPrice(totalBill)}</div>
         </div>
      </div>
   )
}

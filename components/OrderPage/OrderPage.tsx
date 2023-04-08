import React, { useContext, useEffect, useState } from 'react'
import { formatPrice } from '../../utils/dataHelper'
import { menuContext } from '../contexts/MenuProvider'
import style from './OrderPage.module.scss'
import { MenuItemGroup } from '../../models/interfaces'
import { FaWindowClose } from 'react-icons/fa'
import LoaderComponent from '../verse/LoaderComponent'
import useStoredCheckout from '../../hooks/useStoredCheckout'
import { CHECKOUT_STORAGE_KEY, CURRENT_ORDERS_KEY } from '../../constants/localStorageConstants'
import useSimpleLocalStorage from '../../hooks/useStoredSentOrder'
import sendOrderData from './sendOrderData'
import { useRouter } from 'next/router'

export default function OrderPage() {
   const router = useRouter()

   // This one manages orders sent to shopkeeper
   const { addItem } = useSimpleLocalStorage(CURRENT_ORDERS_KEY)

   const { menuItems, toppings, sauces, menuItemOptions } = useContext(menuContext)

   // This one manages orders yet to be sent to shopkeeper
   const { storedData, manageableStorage, setLocalStorage, clearLocalStorage } =
      useStoredCheckout<MenuItemGroup>(CHECKOUT_STORAGE_KEY)
   // counting amount of each repeated order
   const [counter, setCounter] = useState<number[]>(
      manageableStorage.map((list) => list.ids.length)
   )
   const priceWatcher = () => {
      let bill = 0
      manageableStorage.forEach((unique, idx) => {
         bill += unique.order.subTotal * counter[idx]
      })
      return bill
   }
   const [totalBill, setTotalBill] = useState<number>(priceWatcher())

   useEffect(() => {
      setCounter(manageableStorage.map((list) => list.ids.length))
   }, [storedData])
   useEffect(() => {
      setTotalBill(priceWatcher())
   }, [counter])

   const findItemName = <T extends { id: string; name: string }>(
      objArray: T[],
      elem: MenuItemGroup | string
   ): string => {
      const comparator = typeof elem === 'string' ? elem : elem.menuItemId
      const res = objArray.find((a) => a.id === comparator)
      return res !== undefined ? res.name : `Absent Model: ${comparator}`
   }

   return (
      <div className={`${style.orderPageOuterDiv} ${style.hideScroller} font-medium my-12 mb-52`}>
         <div
            className={`${style.topTitle} ${style.hideScroller} relative font-semibold text-xl my-12 w-screen`}
         >
            <div className={`${style.hideScroller} text-left`}>Seu Pedido</div>
         </div>
         {storedData.length === 0 && (
            <div className='text-4xl m-6'>Você não selecionou nenhum item ainda.</div>
         )}
         {manageableStorage.map((e, idx) => (
            <div key={e.order.menuItemId + String(idx)} id={String(idx)}>
               <div className={`${style.singleItem} relative grid gap-3 my-1 w-screen`}>
                  <div className='flex flex-col'>
                     <p
                        className={`text-center m-auto h-7 w-14 ${style.b}`}
                        onClick={() => setLocalStorage(manageableStorage, idx, 'addition')}
                     >
                        +
                     </p>
                     <p className={`text-center m-auto`}>{counter[idx]}x</p>
                     <p
                        className={`text-center m-auto h-7 w-14 ${style.b}`}
                        onClick={() => setLocalStorage(manageableStorage, idx, 'subtraction')}
                     >
                        -
                     </p>
                  </div>
                  {/* <Link href={linkToItemsPage(e, counter[idx])} passHref> */}
                  <div>
                     <div className='font-semibold'>
                        {findItemName(menuItems, e.order.menuItemId)}
                     </div>
                     <div className={`${style.itemInfo}`}>
                        {!!e.order.extraSauceIds && e.order.extraSauceIds.length !== 0 && (
                           <>
                              <div className='font-semibold text-base'>Molhos</div>
                              {e.order.extraSauceIds.map((id) => (
                                 <div key={id}>{findItemName(sauces, id)}</div>
                              ))}
                           </>
                        )}
                        {!!e.order.extraToppingIds && e.order.extraToppingIds.length !== 0 && (
                           <>
                              <div className='font-semibold text-base'>Adicionais</div>
                              {e.order.extraToppingIds.map((id) => (
                                 <div key={id}>{findItemName(toppings, id)}</div>
                              ))}
                           </>
                        )}
                        {!!e.order.optionId && e.order.optionId.length !== 0 && (
                           <div>{findItemName(menuItemOptions, e.order.optionId)}</div>
                        )}
                     </div>
                  </div>
                  {/* </Link> */}
                  <div className='text-right'>{formatPrice(e.order.subTotal)}</div>
                  <div
                     id={`o-${String(idx)}`}
                     className={`relative`}
                     onClick={() => setLocalStorage(manageableStorage, idx, 'remotion')}
                  >
                     <FaWindowClose size={20} />
                  </div>
               </div>
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
                     storedData.length !== 0
                        ? { background: 'var(--global-primary-color)', color: 'black', padding: '0.70rem' }
                        : { background: 'lightgray', color: 'gray', padding: '0.70rem' }
                  }
                  disabled={storedData.length === 0}
                  onClick={() =>
                     sendOrderData(storedData, (orderId: string) => {
                        addItem(orderId)
                        router.push('/track_order?justOrdered=true')
                        clearLocalStorage()
                     })
                  }
               >
                  Confirmar Pedido
               </button>
            </div>
            <div className='text-right'>{formatPrice(totalBill)}</div>
         </div>

         <LoaderComponent show={menuItems.length === 0} />
      </div>
   )
}

import React, { useContext, useEffect, useState } from 'react'
import { formatPrice } from '../../utils/dataHelper'
import { menuContext } from '../contexts/MenuProvider'
import style from './OrderPage.module.scss'
import { MenuItemGroup } from '../../models/interfaces'
import { FaWindowClose, FaTrashAlt } from 'react-icons/fa'
import LoaderComponent from '../verse/LoaderComponent'
import { MenegeableStorage } from '../../hooks/useStoredCheckout'
import { CURRENT_ORDERS_KEY } from '../../constants/localStorageConstants'
import useSimpleLocalStorage from '../../hooks/useStoredSentOrder'
import sendOrderData from './sendOrderData'
import { useRouter } from 'next/router'
import { localStorageContext } from '../contexts/LocalStorageProvider'
import { createManageableStorage } from '../../utils/localStorageHelper'
import { generateID } from '../../utils/modelHelper'
import PrimaryButton from '../verse/PrimaryButton'

export default function OrderPage() {
   const router = useRouter()

   const { menuItemGroups, addMenuItemGroup, removeMenuItemGroup, clearMenuItemGroups } =
      useContext(localStorageContext)
   const [manageableLocalStorage, setManageableLocalStorage] = useState(
      createManageableStorage(menuItemGroups)
   )

   const priceWatcher = () => {
      return manageableLocalStorage.reduce((total, unique) => {
         return total + unique.order.subTotal * unique.ids.length
      }, 0)
   }

   useEffect(() => {
      setManageableLocalStorage(createManageableStorage(menuItemGroups))
   }, [menuItemGroups])

   type ActionType = 'addition' | 'subtraction'
   const settingLocalStorage = (
      object: MenegeableStorage<MenuItemGroup>,
      action: ActionType,
      idx: number
   ) => {
      if (action === 'addition') {
         const id = generateID()
         const selectedManageable = { ...object.order, id }
         const resetedLocalStorage = Object.assign(
            { id: null },
            selectedManageable
         ) as MenuItemGroup
         addMenuItemGroup(resetedLocalStorage)
      } else if (action === 'subtraction') {
         const allIds = manageableLocalStorage[idx].ids
         removeMenuItemGroup(allIds[allIds.length - 1])
      }
   }

   const removeSingleItem = (itemOrder: number) => {
      const manageableList = [...manageableLocalStorage[itemOrder].ids]
      removeMenuItemGroup(manageableList)
   }

   // This one manages orders sent to shopkeeper
   const { addItem } = useSimpleLocalStorage(CURRENT_ORDERS_KEY)

   const { menuItems, toppings, sauces, menuItemOptions } = useContext(menuContext)

   const findItemName = <T extends { id: string; name: string }>(
      objArray: T[],
      elem: MenuItemGroup | string
   ): string => {
      const comparator = typeof elem === 'string' ? elem : elem.menuItemId
      const res = objArray.find((a) => a.id === comparator)
      return res !== undefined ? res.name : `Absent Model: ${comparator}`
   }

   const [notification, setNotification] = useState(false)

   return (
      <div className={`${style.orderPageOuterDiv} ${style.hideScroller} font-medium my-12 mb-52`}>
         <div
            className={`${style.topTitle} ${style.hideScroller} relative font-semibold text-xl my-12 w-screen`}
         >
            <div className={`${style.hideScroller} text-left`}>Seu Pedido</div>
         </div>
         {menuItemGroups.length === 0 && (
            <div className='text-4xl m-6'>Você não selecionou nenhum item ainda.</div>
         )}
         {manageableLocalStorage.map((e, idx) => (
            <div key={e.order.menuItemId + String(idx)} id={String(idx)}>
               <div className={`${style.singleItem} relative grid gap-3 my-1 w-screen`}>
                  <div className='flex flex-col'>
                     <p
                        className={`text-center m-auto h-7 w-14 ${style.b}`}
                        onClick={() => {
                           settingLocalStorage(e, 'addition', idx)
                        }}
                     >
                        +
                     </p>
                     <p className={`text-center m-auto`}>{e.ids.length}x</p>
                     <p
                        className={`text-center m-auto h-7 w-14 ${style.b}`}
                        onClick={() => {
                           settingLocalStorage(e, 'subtraction', idx)
                        }}
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
                     onClick={() => {
                        //setLocalStorage(manageableStorage, idx, 'remotion')
                        removeSingleItem(idx)
                     }}
                  >
                     <FaWindowClose size={20} />
                  </div>
               </div>
            </div>
         ))}
         <div>
            {manageableLocalStorage.length > 0 && (
               <div
                  className={`relative flex justify-end gap-3 my-1 w-screen py-4 px-5`}
                  style={{ background: 'none' }}
               >
                  <div>
                     <PrimaryButton
                        label='Apagar tudo'
                        bgColor='red'
                        icon={<FaTrashAlt />}
                        clickHandler={() => setNotification(true)}
                     />
                  </div>
               </div>
            )}
         </div>
         <div
            className='absolute inset-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-80 z-30'
            style={{ display: notification ? 'flex' : 'none' }}
         >
            <div
               className='flex flex-col justify-center items-center border-4 h-56 w-80'
               style={{ background: '#222327', borderColor: '#d3d3d3' }}
            >
               <p className='relative m-4'>
                  Você tem certeza que deseja apagar todos os itens do seu pedido?
               </p>
               <div className='flex flex-row gap-3'>
                  <PrimaryButton label='Não' clickHandler={() => setNotification(false)} />
                  <PrimaryButton
                     label='Sim'
                     bgColor='none'
                     clickHandler={() => {
                        clearMenuItemGroups()
                        setNotification(false)
                     }}
                  />
               </div>
            </div>
         </div>
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
                     menuItemGroups.length !== 0
                        ? { background: '#29fd53', color: 'black', padding: '0.70rem' }
                        : { background: 'lightgray', color: 'gray', padding: '0.70rem' }
                  }
                  disabled={menuItemGroups.length === 0}
                  onClick={() =>
                     sendOrderData(menuItemGroups, (orderId: string) => {
                        addItem(orderId)
                        router.push('/track_order?justOrdered=true')
                        clearMenuItemGroups()
                     })
                  }
               >
                  Confirmar Pedido
               </button>
            </div>
            <div className='text-right'>{formatPrice(priceWatcher())}</div>
         </div>

         <LoaderComponent show={menuItems.length === 0} />
      </div>
   )
}

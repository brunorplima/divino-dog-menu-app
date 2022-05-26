import React, { useContext } from 'react'
import { menuItemGroups } from '../../utils/localStorageHelper'
import { fotmatPrice } from '../../utils/dataHelper'
import { menuContext } from '../contexts/MenuProvider'
import AddOnsOrderPage from './AddOnsOrderPage'
import style from './OrderPage.module.scss'
import { MenuItemGroup } from '../../models/interfaces'
import MenuItemModel from '../../models/MenuItemModel'
import ToppingModel from '../../models/ToppingModel'
import SauceModel from '../../models/SauceModel'
import { FaWindowClose } from 'react-icons/fa'
import Link from 'next/link'

interface Temp {
   id: string
   menuItemId: string
   subTotal: number
   extraToppingIds: string[]
   extraSauceIds: string[]
}

export default function OrderPage() {
   const { menuItems, toppings, sauces } = useContext(menuContext)

   const order = menuItemGroups()

   /* const order: Temp[] = [
      {
         id: '6D9ENE36LDHZN',
         menuItemId: 'IQGMYX5H9COSH',
         subTotal: 14,
         extraToppingIds: ['ATD9AJM3XDN6J', 'KYB0OO8L5WIJ2'],
         extraSauceIds: ['N5QCTGETAJDQR'],
      },
      {
         id: 'C265ERF2NUPEG',
         menuItemId: 'ZXWVEUURJ0NHQ',
         subTotal: 19,
         extraToppingIds: ['4JSOWF6TEIYZ2', '9XBQAI7WDP4CM', 'V3SORZUJXRLU3'],
         extraSauceIds: [],
      },
      {
         id: 'EMDOIP1N3URT7',
         menuItemId: 'ZXWVEUURJ0NHQ',
         subTotal: 19,
         extraToppingIds: ['4JSOWF6TEIYZ2', '9XBQAI7WDP4CM', 'V3SORZUJXRLU3'],
         extraSauceIds: [],
      },
   ] */

   const findItemName = (
      objArray: Temp[] | MenuItemModel[] | ToppingModel[] | SauceModel[],
      elem: MenuItemGroup | string
   ) => {
      const comparator = typeof elem === 'string' ? elem : elem.menuItemId
      // @ts-ignore
      const res = objArray.find((a) => a.id === comparator)
      return res !== undefined ? res.name : `Absent Item: ${comparator}`
   }

   const uniqueStringOrder = () => {
      const unique: string[] = []
      order.forEach((o) => {
         const { id, ...u } = o
         unique.push(JSON.stringify(u))
      })
      return unique.filter((value, index, self) => self.indexOf(value) === index)
   }

   const formattingOrder = () => {
      const uniqueItems = uniqueStringOrder()
      const positions: number[] = []
      order.forEach((value) => {
         const { id, ...obj } = value
         positions.push(uniqueItems.indexOf(JSON.stringify(obj)))
      })
      console.log(positions)
      return [uniqueItems.map((e) => JSON.parse(e)), positions]
   }

   const [Order, amount] = formattingOrder()

   const countItemQuantity = (num: number) => {
      let counter = 0
      amount.forEach((n) => {
         n === num && counter++
      })
      return counter
   }

   let totalBill = 0

   const excludeItem = (elem: React.MouseEvent) => {
      // @ts-ignore
      const targetId = elem.currentTarget.parentNode.parentNode.parentNode.id
      console.log(targetId)
   }

   return (
      <div className={`${style.orderPageOuterDiv} ${style.hideScroller} font-medium my-12 mb-52`}>
         <div
            className={`${style.hideScroller} relative font-semibold text-xl my-12`}
            style={{
               background: '#29fd53',
               color: 'black',
               padding: '1rem 3rem',
               left: '-1rem',
               width: '100vw',
            }}
         >
            <div className={`${style.hideScroller} text-left`}>Seu Pedido</div>
         </div>
         {Order.map((e, idx) => (
            <div key={e.menuItemId + String(idx)} id={`o-${String(idx)}`}>
               <div
                  className='relative grid gap-3 my-1'
                  style={{
                     background: '#444549',
                     padding: '1rem 1.3rem',
                     left: '-1rem',
                     width: '100vw',
                     gridTemplateColumns: '1fr 3fr 2fr 1fr',
                  }}
               >
                  <div>{countItemQuantity(idx)}x</div>
                  <div>
                     <div className='font-semibold'>{findItemName(menuItems, e)}</div>
                     <div style={{ color: 'lightgray', fontSize: '0.85rem' }}>
                        {e.extraSauceIds !== undefined && e.extraSauceIds.length !== 0 && (
                           <AddOnsOrderPage
                              addOnsNameGroup={'Molhos'}
                              allAddOns={sauces}
                              orderedAddOns={e.extraSauceIds}
                              findItemName={findItemName}
                           />
                        )}
                        {e.extraToppingIds !== undefined && e.extraToppingIds.length !== 0 && (
                           <AddOnsOrderPage
                              addOnsNameGroup={'Adicionais'}
                              allAddOns={toppings}
                              orderedAddOns={e.extraToppingIds}
                              findItemName={findItemName}
                           />
                        )}
                     </div>
                  </div>
                  <div className='text-right'>
                     {fotmatPrice(e.subTotal * countItemQuantity(idx))}
                  </div>
                  <div className='relative right-0'>
                     <div id={String(idx)} className='right-0' onClick={excludeItem}>
                        <FaWindowClose size={20} />
                     </div>
                  </div>
               </div>
               <span className='hidden'>{(totalBill += e.subTotal * countItemQuantity(idx))}</span>
            </div>
         ))}
         <br />
         <br />
         <br />
         <br />
         <br />
         <br />
         <div
            className='fixed grid grid-cols-2 gap-3 font-semibold mt-12'
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
               <Link href={'/'}>
                  <a
                     className='rounded-lg'
                     style={{ background: '#29fd53', color: 'black', padding: '0.70rem' }}
                  >
                     Confirmar Pedido
                  </a>
               </Link>
            </div>
            <div className='text-right'>{fotmatPrice(totalBill)}</div>
         </div>
      </div>
   )
}

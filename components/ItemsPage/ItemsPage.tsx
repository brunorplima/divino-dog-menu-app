import { Fragment, useContext, useEffect, useState } from 'react'
import { menuContext } from '../contexts/MenuProvider'
import AddOns from './AddOns'
import styles from './ItemsPage.module.scss'
import { MenuItemGroup } from '../../models/interfaces'
import * as R from 'ramda'
import { MENU_ITEM_GROUP_KEY, addMenuItemGroup } from '../../utils/localStorageHelper'
import { fotmatPrice } from '../../utils/dataHelper'
import Link from 'next/link'
import { IoIosArrowDropleftCircle } from 'react-icons/io'
import useLocalStorage from '../../hooks/useLocalStorage'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import { stringToArray } from '../../utils/dataHelper'
import { generateID } from '../../utils/modelHelper'

interface Props {
   query: NextParsedUrlQuery
}

const ItemsPage = (props: Props) => {
   const { query } = props
   const { itemId, catId, itemsIds, quantity, boxes } = query
   const { menuItems, toppings, sauces } = useContext(menuContext)

   const definePrice = () => {
      let price: number

      const myItem = menuItems.find((item) => item.id === itemId)
      price = myItem !== undefined ? myItem.price : 0

      const myAddOns = stringToArray(boxes)
      myAddOns.forEach((add) => {
         const toppPrice = toppings.find((item) => item.id === add)
         if (toppPrice !== undefined) price += toppPrice.price ? toppPrice.price : 0

         const saucePrice = sauces.find((item) => item.id === add)
         if (saucePrice !== undefined) price += saucePrice.price ? saucePrice.price : 0
      })

      return price
   }

   const theItem = menuItems.find((item) => item.id === itemId)
   const minimumPrice = theItem !== undefined ? theItem.price : 0
   const [addOns, setAddOns] = useState<string[]>(stringToArray(boxes))
   const [price, setPrice] = useState(definePrice()) //(theItem ? theItem.price : 0)
   const [quant, setQuant] = useState(() => {
      if (quantity === undefined) return 1
      if (typeof quantity === 'object') return 1
      else return parseInt(quantity)
   })
   /* useEffect(() => {
      setPrice(definePrice())
      setAddOns(stringToArray(boxes))
   }, []) */

   const sections = [
      { sect: theItem?.toppingIds, title: 'Escolha seus Adicionais', addonList: toppings },
      { sect: theItem?.sauceIds, title: 'Escolha seus Molhos', addonList: sauces },
   ]

   const interfacingMenuItemGroup = (quantity: number): Omit<MenuItemGroup, 'id'>[] | undefined => {
      if (theItem !== undefined) {
         const extraToppingIds = R.reject(
            R.isNil,
            toppings.map((topping) => addOns.find((item) => topping.id === item))
         )
         const extraSauceIds = R.reject(
            R.isNil,
            sauces.map((sauce) => addOns.find((item) => sauce.id === item))
         )
         const finalInterface = []
         for (let i = 0; i < quantity; i++) {
            finalInterface.push({
               menuItemId: theItem.id,
               subTotal: price,
               extraToppingIds: extraToppingIds,
               extraSauceIds: extraSauceIds,
            })
         }
         return finalInterface
      }
   }

   const saveInLocalStorage = () => {
      const itemsGroupObject = interfacingMenuItemGroup(quant)
      itemsGroupObject !== undefined && itemsGroupObject.forEach((item) => addMenuItemGroup(item))
   }

   const { storedList, setStoredList, clearLocalStorage } =
      useLocalStorage<MenuItemGroup>(MENU_ITEM_GROUP_KEY)
   const replaceInLocalStorage = () => {
      const orderIndices: number[] = []
      storedList.forEach((item, idx) => {
         stringToArray(itemsIds).includes(item.id) && orderIndices.push(idx)
      })
      const position = orderIndices[0]
      const itemsGroupObject = interfacingMenuItemGroup(quant)
      if (itemsGroupObject !== undefined) {
         itemsGroupObject.forEach((item, idx) =>
            storedList.splice(position + idx, 0, { id: generateID(), ...item })
         )
         const ids = stringToArray(itemsIds)
         clearLocalStorage()
         storedList.forEach((item) => !ids.includes(item.id) && addMenuItemGroup(item))
      }
      setStoredList(storedList)
   }

   const addonAvailability = (addonArray: string[] | undefined) => {
      if (addonArray === undefined) return false
      if (addonArray.length === 0) return false
      else return true
   }

   return (
      <div
         className={`${styles.content} text-white relative text-xl overflow-y-scroll overflow-x-hidden px-4 -pb-64`}
      >
         {theItem && (
            <>
               {theItem.categoryId === catId && (
                  <>
                     <div
                        className={`${styles.foodImage} absolute ${theItem.img && 'bg-cover'}`}
                        style={{
                           background: `url(${
                              theItem.img ? theItem.img : '/standard-food-bg.jpeg'
                           }) no-repeat center`,
                        }}
                     ></div>
                     <Link href={`${itemsIds === undefined ? '/' : '/checkout'}`} passHref>
                        <div
                           className='fixed z-20 top-4 left-4 text-5xl'
                           style={{ color: '#29fd53' }}
                        >
                           <IoIosArrowDropleftCircle />
                        </div>
                     </Link>
                     <div className={`${styles.itemDescription} relative flex flex-col gap-6`}>
                        <div className='text-4xl font-bold'>{theItem.name}</div>
                        <div>{theItem.description}</div>
                        <div className='pb-4'>
                           {sections.map((section) => (
                              <Fragment key={section.title}>
                                 {addonAvailability(section.sect) && section.sect !== undefined && (
                                    <AddOns
                                       addOnIds={section.sect}
                                       title={section.title}
                                       addonList={section.addonList}
                                       addOns={addOns}
                                       setAddOns={setAddOns}
                                       price={price}
                                       setPrice={setPrice}
                                       minimumPrice={minimumPrice}
                                       boxes={boxes}
                                    />
                                 )}
                              </Fragment>
                           ))}
                        </div>
                        <div
                           className={`${styles.itemQuantity} relative text-base p-4 inset-x-0 items-center justify-center text-center mb-40`}
                        >
                           <div className={`mb-3`}>Quantidade</div>
                           <div className={`${styles.innerItemQuantity} grid font-semibold`}>
                              <div>
                                 <a
                                    onClick={() => {
                                       setQuant(quant - 1 <= 0 ? 1 : quant - 1)
                                    }}
                                 >
                                    -
                                 </a>
                              </div>
                              <div>
                                 <span>{quant}</span>
                              </div>
                              <div>
                                 <a
                                    onClick={() => {
                                       setQuant(quant + 1)
                                    }}
                                 >
                                    +
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </>
               )}
               <Link href={`${itemsIds === undefined ? '/' : '/checkout'}`} passHref>
                  <div
                     className={`${styles.priceOrder} fixed flex flex-row font-semibold inset-x-0 bottom-0 py-4 px-8 cursor-pointer`}
                     onClick={() => {
                        !itemsIds && saveInLocalStorage()
                        itemsIds && replaceInLocalStorage()
                     }}
                  >
                     <div className='block w-full text-left'>
                        {quantity !== undefined ? 'Alterar Pedido' : 'Adicionar'}
                     </div>
                     <div className='block w-full text-right'>{fotmatPrice(quant * price)}</div>
                  </div>
               </Link>
            </>
         )}
      </div>
   )
}

export default ItemsPage

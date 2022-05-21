import { Fragment, useContext, useEffect, useState } from 'react'
import { menuContext } from '../contexts/MenuProvider'
import AddOns from './AddOns'
import styles from './ItemsPage.module.scss'
import { MenuItemGroup } from '../../models/interfaces'
import * as R from 'ramda'
import { addMenuItemGroup } from '../../utils/localStorageHelper'
import { fotmatPrice } from '../../utils/dataHelper'
import Link from 'next/link'

interface Props {
   itemId: string | string[] | undefined
   catId: string | string[] | undefined
}

const ItemsPage = (props: Props) => {
   const { itemId, catId } = props
   const { menuItems, toppings, sauces } = useContext(menuContext)

   const [quant, setQuant] = useState(1)

   const theItem = menuItems.find((item) => item.id === itemId)
   const minimumPrice = theItem !== undefined ? theItem.price : 0
   const [addOns, setAddOns] = useState<string[]>([''])
   const [price, setPrice] = useState(0)
   useEffect(() => {
      theItem && setPrice(theItem.price)
   }, [theItem])

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
               <Link href={'/'}>
                  <div
                     className={`${styles.priceOrder} fixed flex flex-row font-semibold inset-x-0 bottom-0 py-4 px-8 cursor-pointer`}
                     onClick={() => {
                        saveInLocalStorage()
                     }}
                  >
                     <div className='block w-full text-left'>Adicionar</div>
                     <div className='block w-full text-right'>{fotmatPrice(quant * price)}</div>
                  </div>
               </Link>
            </>
         )}
      </div>
   )
}

export default ItemsPage

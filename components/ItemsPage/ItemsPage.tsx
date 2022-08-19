import { Fragment, useContext, useEffect, useState } from 'react'
import { menuContext } from '../contexts/MenuProvider'
import AddOns from './AddOns'
import styles from './ItemsPage.module.scss'
import { MenuItemGroup } from '../../models/interfaces'
import * as R from 'ramda'
import { addMenuItemGroup } from '../../utils/localStorageHelper'
import { checkPromoDate, formatPrice } from '../../utils/dataHelper'
import Link from 'next/link'
import { IoIosArrowDropleftCircle } from 'react-icons/io'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import { stringToArray } from '../../utils/dataHelper'
import { getServerDate } from '../../utils/apiHelper'
import { settingsContext } from '../contexts/SettingsProvider'

interface Props {
   query: NextParsedUrlQuery
}

const ItemsPage = (props: Props) => {
   const { query } = props
   const { itemId, catId, itemsIds, quantity, boxes } = query
   const { menuItems, toppings, sauces, menuItemOptions } = useContext(menuContext)

   const { settingsModel } = useContext(settingsContext)
   const maxAmount = settingsModel?.maxAmountOfAddons ? settingsModel?.maxAmountOfAddons : 0
   const toppingsAllowed = settingsModel?.allowUserToAddToppings
      ? settingsModel?.allowUserToAddToppings
      : false

   const definePrice = (serverDate?: Date) => {
      let price = 0

      const myItem = menuItems.find((item) => item.id === itemId)
      const diffDate = checkPromoDate(myItem, serverDate)

      if (myItem === undefined) price = 0
      else if (myItem.promoPrice === undefined) price = myItem.price
      else if (diffDate) price = myItem.promoPrice.price
      else price = myItem.price

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
   const [price, setPrice] = useState(definePrice())
   const [quant, setQuant] = useState(() => {
      if (quantity === undefined) return 1
      if (typeof quantity === 'object') return 1
      else return parseInt(quantity)
   })

   useEffect(() => {
      const serverDate = getServerDate()
      serverDate.then((resp) => {
         definePrice(resp)
      })
   }, [])

   useEffect(() => {
      setPrice(definePrice())
      typeof quantity === 'string' && setQuant(parseInt(quantity))
   }, [definePrice(), quantity])

   const sections = [
      {
         sect: theItem?.toppingIds,
         title: 'Escolha seus Adicionais',
         addonList: toppings,
         singleOption: false,
      },
      /* {
         sect: theItem?.sauceIds,
         title: 'Escolha seus Molhos',
         addonList: sauces,
         singleOption: false,
      }, */
      {
         sect: theItem?.optionIds,
         title: 'Escolha sua Opção',
         addonList: menuItemOptions,
         subTitle: 'Escolha obrigatória',
         singleOption: true,
      },
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
         const optionId = R.reject(
            R.isNil,
            menuItemOptions.map((option) => addOns.find((item) => option.id === item))
         )
         const finalInterface: Omit<MenuItemGroup, 'id'>[] = []
         for (let i = 0; i < quantity; i++) {
            finalInterface.push({
               menuItemId: theItem.id,
               subTotal: price,
               extraToppingIds: extraToppingIds,
               extraSauceIds: extraSauceIds,
               optionId: optionId[0],
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

   const defineButtonState = (addOnsTester: any[] = []) => {
      if (theItem?.optionIds && theItem?.optionIds?.length > 0 && addOnsTester.includes(undefined))
         return false
      else return true
   }
   const [buttonState, setButtonState] = useState(defineButtonState())
   useEffect(() => {
      setButtonState(defineButtonState(addOns))
   }, [addOns])

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
                        {(theItem.optionIds?.length === 0 || !theItem.optionIds) &&
                           toppingsAllowed && (
                              <div className='pt-4 font-semibold'>
                                 {maxAmount === 1 && `Somente 1 adicional permitido`}
                                 {maxAmount >= 2 && `Até ${maxAmount} adicionais permitidos`}
                              </div>
                           )}
                        <div>
                           {sections.map((section) => (
                              <Fragment key={section.title}>
                                 {maxAmount > 0 &&
                                    (toppingsAllowed || section.singleOption) &&
                                    addonAvailability(section.sect) &&
                                    section.sect !== undefined && (
                                       <AddOns
                                          addOnIds={section.sect}
                                          title={section.title}
                                          subTitle={section.subTitle}
                                          singleOption={section.singleOption}
                                          addonList={section.addonList}
                                          addOns={addOns}
                                          setAddOns={setAddOns}
                                          price={price}
                                          setPrice={setPrice}
                                          minimumPrice={minimumPrice}
                                          boxes={boxes}
                                          maxAmount={maxAmount}
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
               <Link
                  href={`${buttonState ? (itemsIds === undefined ? '/' : '/checkout') : '#'}`}
                  passHref
               >
                  <div
                     className={`${buttonState ? styles.greenButton : styles.grayButton} ${
                        styles.priceOrder
                     } fixed flex flex-row font-semibold inset-x-0 bottom-0 py-4 px-8 cursor-pointer`}
                     onClick={() => {
                        if (buttonState) {
                           !itemsIds && saveInLocalStorage()
                        }
                     }}
                  >
                     <div className='block w-full text-left'>
                        {quantity !== undefined ? 'Alterar Pedido' : 'Adicionar'}
                     </div>
                     <div className='block w-full text-right'>{formatPrice(quant * price)}</div>
                  </div>
               </Link>
            </>
         )}
      </div>
   )
}

export default ItemsPage

import { Fragment, useContext, useEffect, useState } from 'react'
import MenuCategories from './MenuCategories'
import ListingItems from './ListingItems'
import { menuContext } from '../contexts/MenuProvider'
import style from './MenuList.module.scss'
import * as R from 'ramda'
import { capitalizeFirstLetter, checkPromoDate } from '../../utils/dataHelper'
import LoaderComponent from '../verse/LoaderComponent'
import MenuItemModel from '../../models/MenuItemModel'
import CategoryModel from '../../models/CategoryModel'
import { getServerDate } from '../../utils/apiHelper'
import { PROMOTION_ID_CATEGORY } from '../../constants/promotionConstants'

export default function MenuList() {
   const { menuItems, categories } = useContext(menuContext)

   const withoutSpaces = (str: string) => str.replace(' ', '')

   const excludeEmptyCategory = (serverDate?: Date) => {
      const sortedCategories = categories.sort((a, b) => a.listOrder - b.listOrder)
      const newCategories = sortedCategories.map(
         (cat) =>
            menuItems.find(
               (x) =>
                  (x.categoryId === cat.id && cat.id !== PROMOTION_ID_CATEGORY) ||
                  (x.promoPrice !== undefined && checkPromoDate(x, serverDate))
            ) && cat
      )
      return R.reject(R.isNil, newCategories)
   }

   const checkCategoriesAndPromo = (
      item: MenuItemModel,
      category: CategoryModel,
      serverDate: Date | undefined
   ) => {
      const isPromotionActive = checkPromoDate(item, serverDate)

      if (item.promoPrice !== undefined && category.id === PROMOTION_ID_CATEGORY && isPromotionActive)
         return true
      if (
         (item.promoPrice === undefined || !isPromotionActive) &&
         category.id !== PROMOTION_ID_CATEGORY &&
         category.id === item.categoryId
      )
         return true
      else return false
   }

   const [serverDate, setServerDate] = useState<Date | undefined>()
   useEffect(() => {
      const thisServerDate = getServerDate()
      thisServerDate.then((resp) => {
         setServerDate(resp)
      })
   }, [])

   return (
      <div className={`${style.menuGeneral} font-medium text-gray-300 mb-10`}>
         <div
            className={`${style.fixedMenu} text-white font-extrabold whitespace-nowrap overflow-x-scroll`}
         >
            <div className={`static z-20`}>
               {excludeEmptyCategory(serverDate).map((category) => (
                  <Fragment key={category.id}>
                     <MenuCategories name={category.name} link={withoutSpaces(category.name)} />
                  </Fragment>
               ))}
            </div>
         </div>
         <div className={`${style.menuContent} overflow-auto z-10`}>
            {excludeEmptyCategory(serverDate).map((category) => (
               <div id={withoutSpaces(category.name)} key={category.id} className='scroll-m-10'>
                  <h2
                     className={`${style.categories} text-2xl pl-5 mt-10 font-extrabold mb-5 text-white italic`}
                     style={{ color: 'var(--global-primary-color)' }}
                  >
                     {capitalizeFirstLetter(category.name)}
                  </h2>
                  {menuItems
                     .sort((a, b) => a.listOrder - b.listOrder)
                     .map((item) => (
                        <Fragment key={item.id}>
                           {checkCategoriesAndPromo(item, category, serverDate) && (
                              <ListingItems
                                 item={item}
                                 isPromotionActive={checkPromoDate(item, serverDate)}
                              />
                           )}
                        </Fragment>
                     ))}
               </div>
            ))}
         </div>

         <LoaderComponent show={menuItems.length === 0}/>
      </div>
   )
}

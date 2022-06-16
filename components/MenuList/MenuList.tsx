import { Fragment, useContext } from 'react'
import MenuCategories from './MenuCategories'
import ListingItems from './ListingItems'
import { menuContext } from '../contexts/MenuProvider'
import style from './MenuList.module.scss'
import * as R from 'ramda'
import { capitalizeFirstLetter } from '../../utils/dataHelper'
import { PromoPrice } from '../../models/interfaces'
import MenuItemModel from '../../models/MenuItemModel'
import CategoryModel from '../../models/CategoryModel'

export default function MenuList() {
   const { menuItems, categories } = useContext(menuContext)

   const excludeEmptyCategory = () => {
      const sortedCategories = categories.sort((a, b) => a.listOrder - b.listOrder)
      const newCategories = sortedCategories.map(
         (cat) => menuItems.find((x) => x.categoryId === cat.id || x.promoPrice) && cat
      )
      return R.reject(R.isNil, newCategories)
   }

   const withoutSpaces = (str: string) => str.replace(' ', '')

   const checkCategoriesAndPromo = (item: MenuItemModel, category: CategoryModel) => {
      if (item.promoPrice !== undefined && category.name === 'Promoções') return true
      if (
         item.promoPrice === undefined &&
         category.name !== 'Promoções' &&
         category.id === item.categoryId
      )
         return true
      else return false
   }

   return (
      <div className={`${style.menuGeneral} font-medium text-gray-300 mb-10`}>
         <div
            className={`${style.fixedMenu} text-white font-extrabold whitespace-nowrap overflow-x-scroll`}
         >
            <div className={`static z-20`}>
               {excludeEmptyCategory().map((category) => (
                  <Fragment key={category.id}>
                     <MenuCategories name={category.name} link={withoutSpaces(category.name)} />
                  </Fragment>
               ))}
            </div>
         </div>
         <div className={`${style.menuContent} overflow-auto z-10`}>
            {excludeEmptyCategory().map((category) => (
               <div id={withoutSpaces(category.name)} key={category.id}>
                  <h2 className={`${style.categories} text-2xl font-extrabold mb-5 text-white`}>
                     {capitalizeFirstLetter(category.name)}
                  </h2>
                  {menuItems
                     .sort((a, b) => a.listOrder - b.listOrder)
                     .map((item) => (
                        <Fragment key={item.id}>
                           {checkCategoriesAndPromo(item, category) && <ListingItems item={item} />}
                        </Fragment>
                     ))}
               </div>
            ))}
         </div>
      </div>
   )
}

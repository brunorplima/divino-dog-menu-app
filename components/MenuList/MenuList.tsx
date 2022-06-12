import { Fragment, useContext } from 'react'
import MenuCategories from './MenuCategories'
import ListingItems from './ListingItems'
import { menuContext } from '../contexts/MenuProvider'
import style from './MenuList.module.scss'
import * as R from 'ramda'
import { capitalizeFirstLetter } from '../../utils/dataHelper'

export default function MenuList() {
   const { menuItems, categories } = useContext(menuContext)

   const excludeEmptyCategory = () => {
      const sortedCategories = categories.sort((a, b) => a.listOrder - b.listOrder)
      const newCategories = sortedCategories.map(
         (cat) => menuItems.find((x) => x.categoryId === cat.id) && cat
      )
      return R.reject(R.isNil, newCategories)
   }

   return (
      <div className={`${style.menuGeneral} font-medium text-gray-300 mb-10`}>
         <div
            className={`${style.fixedMenu} text-white font-extrabold whitespace-nowrap overflow-x-scroll`}
         >
            <div className={`static z-20`}>
               {excludeEmptyCategory().map((category) => (
                  <Fragment key={category.id}>
                     <MenuCategories name={category.name} />
                  </Fragment>
               ))}
            </div>
         </div>
         <div className={`${style.menuContent} overflow-auto z-10`}>
            {excludeEmptyCategory().map((category) => (
               <div id={category.name} key={category.id} className={`${style.catContent}`}>
                  <h2 className={`${style.catTitle} italic text-3xl font-extrabold mb-5 mx-4 text-white`}>
                     {capitalizeFirstLetter(category.name)}
                  </h2>
                  {menuItems
                     .sort((a, b) => a.listOrder - b.listOrder)
                     .map(
                        (item) =>
                           category.id === item.categoryId && (
                              <Fragment key={item.id}>
                                 <ListingItems item={item} />
                              </Fragment>
                           )
                     )}
               </div>
            ))}
         </div>
      </div>
   )
}

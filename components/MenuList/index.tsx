import { Fragment, useContext } from "react"
import MenuCategories from "./MenuCategories"
import ListingItems from "./ListingItems"
import { menuContext } from "../contexts/MenuProvider"
import style from "./MenuList.module.scss"
import * as R from "ramda"

export default function MenuList() {
   const { menuItems, categories } = useContext(menuContext)

   const capitalizeFirstLetter = (word: string) =>
      word.toLowerCase().charAt(0).toUpperCase() + word.slice(1)

   const excludeEmptyCategory = () => {
      const sortedCategories = categories.sort(
         (a, b) => a.listOrder - b.listOrder
      )
      const newCategories = sortedCategories.map(
         (cat) => menuItems.find((x) => x.categoryId === cat.id) && cat
      )
      return R.reject(R.isNil, newCategories)
   }

   return (
      <div className={`${style.menuGeneral} px-4 font-medium text-gray-300 bg-gray-700`}>
         <div className={`${style.fixedMenu} text-white font-extrabold whitespace-nowrap overflow-x-scroll`}>
            <div className={`${style.listCategories} z-20`}>
               {excludeEmptyCategory().map((category) => (
                  <Fragment key={category.id}>
                     <MenuCategories
                        name={category.name}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                     />
                  </Fragment>
               ))}
            </div>
         </div>
         <hr />
         <br />
         <div className={`${style.menuContent} max-h-screen overflow-auto inset-y-16 z-10`}>
            {excludeEmptyCategory().map((category) => (
               <div id={category.name} key={category.id}>
                  <h2 className={`${style.categories} text-2xl font-extrabold mb-5 text-white`}>
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
         <br />
         <br />
         <br />
      </div>
   )
}

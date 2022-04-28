import { Fragment } from "react"
import MenuCategories from "./MenuCategories"
import ListingItems from "./ListingItems"
import categories from "./temp_db/category.json"
import menu from "./temp_db/menu.json"
import style from "./MenuList.module.scss"
import * as R from "ramda"

export default function MenuList() {
   const capitalizeFirstString = (string: string) =>
      string.toLowerCase().charAt(0).toUpperCase() + string.slice(1)

   const excludeEmptyCategory = () => {
      const sortedCategories = categories.sort((a, b) => a.sequence - b.sequence)
      const newCategories = sortedCategories.map(
         (cat) => menu.find((x) => x.category === cat.id) && cat
      )
      return R.reject(R.isNil, newCategories)
   }

   return (
      <div className={`${style.menuGeneral} px-4 font-medium text-gray-300 bg-gray-700`}>
         <div className={`${style.fixedMenu} text-white font-extrabold whitespace-nowrap overflow-x-scroll`}>
            <ul className={`${style.listCategories} z-20`}>
               {excludeEmptyCategory().map((category) => (
                  <Fragment key={category.id}>
                     <MenuCategories
                        name={category.name}
                        capitalizeFirstString={capitalizeFirstString}
                     />
                  </Fragment>
               ))}
            </ul>
         </div>
         <hr />
         <br />
         <div className={`${style.menuContent} max-h-screen overflow-auto inset-y-16 z-10`}>
            {excludeEmptyCategory().map((category) => (
               <div id={category.name} key={category.id}>
                  <h2 className={`${style.categories} text-2xl font-extrabold mb-5 text-white`}>
                     {capitalizeFirstString(category.name)}
                  </h2>
                  {menu
                     .sort((a, b) => a.sequence - b.sequence)
                     .map(
                        (item) =>
                           category.id === item.category && (
                              <ListingItems key={item.id} {...item} />
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

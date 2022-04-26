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
      <div className={style.menuGeneral}>
         <div className={style.fixedMenu}>
            <ul className={style.listCategories}>
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
         <div className={style.menuContent}>
            {excludeEmptyCategory().map((category) => (
               <div id={category.name} key={category.id}>
                  <h2 className={style.categories}>
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

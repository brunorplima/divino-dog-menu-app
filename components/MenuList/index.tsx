import { Fragment } from "react"
import MenuCategories from "./MenuCategories"
import ListingItems from "./ListingItems"
import categories from "./temp_db/category.json"
import menu from "./temp_db/menu.json"
import style from "./MenuList.module.scss"

export default function MenuList() {
   const capitalize = (string: string) =>
      string.toLowerCase().charAt(0).toUpperCase() + string.slice(1)

   const excludeEmptyCategory = () =>
      categories
         .sort((a, b) => a.order - b.order)
         .map(
            (category) =>
               menu.find((x) => x.category === category.id) && category
         )

   return (
      <div className={style.menuGeneral}>
         <div className={style.fixedMenu}>
            <ul className={style.listCategories}>
               {excludeEmptyCategory().map(
                  (category) =>
                     category !== undefined && (
                        <Fragment key={category.id}>
                           <MenuCategories
                              name={category.name}
                              capitalize={capitalize}
                           />
                        </Fragment>
                     )
               )}
            </ul>
         </div>
         <hr />
         <br />
         <div className={style.menuContent}>
            {excludeEmptyCategory().map(
               (category) =>
                  category !== undefined && (
                     <div id={category.name} key={category.id}>
                        <h2 className={style.categories}>
                           {capitalize(category.name)}
                        </h2>
                        {menu
                           .sort((a, b) => a.order - b.order)
                           .map(
                              (item) =>
                                 category.id === item.category && (
                                    <ListingItems key={item.id} {...item} />
                                 )
                           )}
                     </div>
                  )
            )}
         </div>
         <br />
         <br />
         <br />
      </div>
   )
}

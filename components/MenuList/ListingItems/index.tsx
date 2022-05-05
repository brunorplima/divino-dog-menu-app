import style from "./Listing.module.scss"
import MenuItemModel from "../../../models/MenuItemModel"

interface Props {
   item: MenuItemModel
}

export default function Listing({ item }: Props) {
   return (
      <div className={`${style.menuItems} py-5 mb-5 relative`}>
         <div>
            <h3 className="font-extrabold">{item.name}</h3>
         </div>
         <div>{item.description}</div>
         <div className={`${style.neonPrice} absolute bottom-0`}>R$ {item.price}</div>
      </div>
   )
}

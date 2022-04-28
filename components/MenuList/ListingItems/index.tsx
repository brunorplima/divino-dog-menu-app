import menu from "../temp_db/menu.json"
import style from "./Listing.module.scss"

type Props = typeof menu[0]

export default function Listing(props: Props) {
   const { name, description, price } = props

   return (
      <div className={`${style.menuItems} py-5 mb-5 relative`}>
         <div>
            <h3 className="font-extrabold">{name}</h3>
         </div>
         <div>{description}</div>
         <div className={`${style.neonPrice} absolute bottom-0`}>R$ {price}</div>
      </div>
   )
}

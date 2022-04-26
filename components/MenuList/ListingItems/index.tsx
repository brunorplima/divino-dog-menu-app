import menu from "../temp_db/menu.json"
import style from "./Listing.module.scss"

type Props = typeof menu[0]

export default function Listing(props: Props) {
   const { name, description, price } = props

   return (
      <div className={style.menuItems}>
         <div>
            <h3>{name}</h3>
         </div>
         <div>{description}</div>
         <div className={style.neonPrice}>R$ {price}</div>
      </div>
   )
}

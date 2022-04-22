import menu from "../temp_db/menu.json"
import style from "./Listing.module.scss"

type Props = typeof menu[0]

export default function Listing(props: Props) {
   const { name, description, price } = props

   return (
      <ul className={style.menuItems}>
         <li>
            <h3>{name}</h3>
         </li>
         <li>{description}</li>
         <li className={style.neonPrice}>R$ {price}</li>
      </ul>
   )
}

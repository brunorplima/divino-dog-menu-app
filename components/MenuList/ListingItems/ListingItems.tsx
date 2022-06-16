import style from './Listing.module.scss'
import MenuItemModel from '../../../models/MenuItemModel'
import Link from 'next/link'
import { fotmatPrice } from '../../../utils/dataHelper'

interface Props {
   item: MenuItemModel
}

export default function Listing({ item }: Props) {
   return (
      <Link href={`/item?itemId=${item.id}&catId=${item.categoryId}`}>
         <a className={`${style.anchorItem} relative bg-white cursor-pointer`}>
            <div>
               <div className={`${style.menuItem} relative grid mb-8 w-screen`}>
                  <div>
                     <h3 className={`${style.itemTitle} font-extrabold`}>{item.name}</h3>
                  </div>
                  <div>{item.description}</div>
                  <div className={`${style.neonPrice} relative bottom-0 font-semibold`}>
                     {item.promoPrice !== undefined ? fotmatPrice(item.promoPrice.price) : fotmatPrice(item.price)}
                  </div>
               </div>
            </div>
         </a>
      </Link>
   )
}

import style from './Listing.module.scss'
import MenuItemModel from '../../../models/MenuItemModel'
import Link from 'next/link'
import { formatPrice } from '../../../utils/dataHelper'

interface Props {
   item: MenuItemModel
   tester: boolean
}

export default function Listing({ item, tester }: Props) {
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
                     {(item.promoPrice !== undefined && tester) ? formatPrice(item.promoPrice.price) : formatPrice(item.price)}
                  </div>
               </div>
            </div>
         </a>
      </Link>
   )
}

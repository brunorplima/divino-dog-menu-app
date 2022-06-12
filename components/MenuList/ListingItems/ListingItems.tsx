import style from './Listing.module.scss'
import MenuItemModel from '../../../models/MenuItemModel'
import Link from 'next/link'

interface Props {
   item: MenuItemModel
}

export default function Listing({ item }: Props) {
   return (
      <Link href={`/item?itemId=${item.id}&catId=${item.categoryId}`}>
         <a className='cursor-pointer'>
            <div className={`${style.menuItems} py-5 mb-5 relative`}>
               <div>
                  <h3 className='font-extrabold'>{item.name}</h3>
               </div>
               <div>{item.description}</div>
               <div className={`${style.neonPrice} absolute bottom-0`}>R$ {item.price}</div>
            </div>
         </a>
      </Link>
   )
}

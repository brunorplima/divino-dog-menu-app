import style from './Listing.module.scss'
import MenuItemModel from '../../../models/MenuItemModel'
import Link from 'next/link'
import { compareWeekDaysToModel, formatPrice } from '../../../utils/dataHelper'
import { useState, useEffect } from 'react'
import { getServerDate } from '../../../utils/apiHelper'

interface Props {
   item: MenuItemModel
   tester: boolean
}

interface LinkRenderProps {
   children: any
   link: boolean
}

export default function Listing({ item, tester }: Props) {
   const [activeItem, setActiveItem] = useState(compareWeekDaysToModel(item.weekDays))

   const LinkRender = ({ children, link }: LinkRenderProps) => {
      if (link)
         return <Link href={`/item?itemId=${item.id}&catId=${item.categoryId}`}>{children}</Link>
      else return <>{children}</>
   }

   useEffect(() => {
      const serverDate = getServerDate()
      serverDate.then((resp) => {
         setActiveItem(compareWeekDaysToModel(item.weekDays, resp))
      })
   }, [])

   return (
      <LinkRender link={activeItem}>
         <a
            className={`${style.anchorItem} ${
               !activeItem ? style.lineThrough : ''
            } relative bg-white cursor-pointer`}
         >
            <div>
               <div className={`${style.menuItem} relative grid mb-8 w-screen`}>
                  <div>
                     <h3 className={`${style.itemTitle} font-extrabold`}>
                        {`${item.name}`}{' '}
                        <span
                           className={
                              item.availableDaysToString() !== '' ? style.weekDays : style.hidden
                           }
                        >{`(disponível ${item.availableDaysToString()})`}</span>
                     </h3>
                  </div>
                  <div>{item.description}</div>
                  <div
                     className={`${
                        !activeItem ? style.gray : style.neonPrice
                     } relative bottom-0 font-semibold`}
                  >
                     {item.promoPrice !== undefined && tester
                        ? formatPrice(item.promoPrice.price)
                        : formatPrice(item.price)}
                  </div>
               </div>
            </div>
         </a>
      </LinkRender>
   )
}

import style from './Listing.module.scss'
import MenuItemModel from '../../../models/MenuItemModel'
import { compareWeekDaysToModel, formatPrice } from '../../../utils/dataHelper'
import { useState, useEffect } from 'react'
import { getServerDate } from '../../../utils/apiHelper'
import ConditionalLinkRender from './ConditionalLinkRender'

interface Props {
   item: MenuItemModel
   isPromotionActive: boolean
}

export default function Listing({ item, isPromotionActive }: Props) {
   const [activeItem, setActiveItem] = useState(compareWeekDaysToModel(item.weekDays))

   useEffect(() => {
      const serverDate = getServerDate()
      serverDate.then((resp) => {
         setActiveItem(compareWeekDaysToModel(item.weekDays, resp))
      })
   }, [])

   return (
      <ConditionalLinkRender link={activeItem} item={item}>
         <div
            className={`${!activeItem ? style.lineThrough : ''} relative bg-white cursor-pointer`}
            data-label={`menu-item-${item.name.toLowerCase().replace(' ', '-')}`}
         >
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
                  {item.promoPrice !== undefined && isPromotionActive
                     ? formatPrice(item.promoPrice.price)
                     : formatPrice(item.price)}
               </div>
            </div>
         </div>
      </ConditionalLinkRender>
   )
}

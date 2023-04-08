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

   const activation = activeItem&&item.isAvailable

   return (
      <ConditionalLinkRender link={activation} item={item}>
         <div
            className={`${!activation ? style.lineThrough : ''} relative bg-white cursor-pointer`}
         >
            <div className={`${style.menuItem} relative grid mb-8 w-screen`}>
               <div>
                  <h3 className={`${style.itemTitle} font-extrabold`}>
                     {`${item.name}`}{' '}{!activation && `(Em falta)`}
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
                     !activation ? style.gray : style.neonPrice
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

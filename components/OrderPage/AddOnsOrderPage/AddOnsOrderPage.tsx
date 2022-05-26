import { MenuItemGroup } from '../../../models/interfaces'
import MenuItemModel from '../../../models/MenuItemModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'

interface Temp {
   id: string
   menuItemId: string
   subTotal: number
   extraToppingIds: string[]
   extraSauceIds: string[]
}

interface Props {
   addOnsNameGroup: string
   allAddOns: ToppingModel[] | SauceModel[]
   orderedAddOns: string[]
   findItemName: (
      objArray: Temp[] | MenuItemModel[] | ToppingModel[] | SauceModel[],
      elem: MenuItemGroup | string
   ) => string
}

export default function AddOnsOrderPage({ addOnsNameGroup, allAddOns, orderedAddOns, findItemName }: Props) {
   return (
      <>
         <div>
            <div className='font-semibold text-base'>{addOnsNameGroup}</div>
            {orderedAddOns.map((t) => (
               <div key={t}>{findItemName(allAddOns, t)}</div>
            ))}
         </div>
      </>
   )
}

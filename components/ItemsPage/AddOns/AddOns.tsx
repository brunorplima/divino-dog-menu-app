import ToppingModel from '../../../models/ToppingModel'
import SauceModel from '../../../models/SauceModel'
import { BaseSyntheticEvent, Dispatch, SetStateAction, useRef } from 'react'
import styles from './AddOns.module.scss'
import { fotmatPrice } from '../../../utils/dataHelper'

interface Props {
   addOnIds: string[]
   title: string
   addonList: ToppingModel[] | SauceModel[]
   addOns: string[]
   setAddOns: Dispatch<SetStateAction<string[]>>
   price: number
   setPrice: Dispatch<SetStateAction<number>>
   minimumPrice: number
}

const AddOns = ({ addOnIds, title, addonList, addOns, setAddOns, price, setPrice, minimumPrice }: Props) => {
   const checkBoxes = useRef<any[]>([])
   checkBoxes.current = []
   const appendInput = (el: any) => {
      if (el && !checkBoxes.current.includes(el)) checkBoxes.current.push(el)
   }

   const unmutableClasses = 'grid my-2 p-4 rounded-xl font-medium w-full'
   const changeCheckBoxClass = (element: any, change: boolean) => {
      const classes = change
         ? `${styles.itemInfo} ${styles.checkedItemInfo} ${unmutableClasses}`
         : `${styles.itemInfo} ${unmutableClasses}`
      element.className = classes
   }

   const changePrice = (event: BaseSyntheticEvent, value: any) => {
      const checkerValue = event.currentTarget.name
      const checker = event.currentTarget.checked
      const currElId = event.currentTarget.id

      if (checker) {
         setPrice(price + value)
         setAddOns([...addOns, checkerValue])
         checkBoxes.current.forEach((ch) => {
            ch.id === currElId && changeCheckBoxClass(ch.parentNode.parentNode.parentNode, true)
         })
      } else {
         setPrice(price - value < minimumPrice ? minimumPrice : price - value)
         setAddOns(addOns.filter((a) => a !== checkerValue))
         checkBoxes.current.forEach((ch) => {
            ch.id === currElId && changeCheckBoxClass(ch.parentNode.parentNode.parentNode, false)
         })
      }
   }

   return (
      <div className={`${styles.topAddons} static`}>
         <div className='my-5 font-semibold'>{title}</div>
         {addonList.map(
            (item) =>
               addOnIds.includes(item.id) &&
               item.isAvailable && (
                  <div
                     key={item.id}
                     className={`${styles.itemInfo} grid my-2 p-4 rounded-xl font-medium w-full`}
                  >
                     <div className='text-base'>
                        <label>{item.name}</label>
                     </div>
                     <div className='justify-center items-center w-4/5 row-start-1 row-end-3 col-start-2 h-full'>
                        <div
                           className={`${styles.checkBoxDiv} relative justify-center item-center`}
                        >
                           <input
                              onClick={(event) => {
                                 changePrice(event, item.price ? item.price : 0)
                              }}
                              className='relative block'
                              type='checkbox'
                              id={item.id}
                              name={item.id}
                              value={item.price}
                              ref={appendInput}
                           />
                        </div>
                     </div>
                     <div className='text-base'>
                        {item.price !== undefined && item.price > 0 && fotmatPrice(item.price)}
                     </div>
                  </div>
               )
         )}
      </div>
   )
}

export default AddOns

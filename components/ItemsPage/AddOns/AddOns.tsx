import ToppingModel from '../../../models/ToppingModel'
import SauceModel from '../../../models/SauceModel'
import styles from './AddOns.module.scss'
import { formatPrice } from '../../../utils/dataHelper'
import useElementRefList from '../../../hooks/useElementRefList'
import { useEffect, useState } from 'react'
import useMultipleStatesManager from '../../../hooks/useMultipleStatesManager'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import CheckBox from '../../book/CheckBox'

interface Props {
   addOnIds: string[]
   title: string
   subTitle?: string
   singleOption: boolean
   addonList: ToppingModel[] | SauceModel[] | MenuItemOptionModel[]
   addOns: string[]
   setAddOns: React.Dispatch<React.SetStateAction<string[]>>
   price: number
   setPrice: React.Dispatch<React.SetStateAction<number>>
   minimumPrice: number
   boxes: string | string[] | undefined
}

const AddOns = ({
   addOnIds,
   title,
   subTitle,
   singleOption,
   addonList,
   addOns,
   setAddOns,
   price,
   setPrice,
   minimumPrice,
   boxes,
}: Props) => {
   const { lightBoxes, runLightBoxesState } = useMultipleStatesManager<
      ToppingModel | SauceModel | MenuItemOptionModel
   >(addonList, boxes)

   const { ElementReffed, ElementReffer } = useElementRefList<HTMLInputElement>()

   const changeCheckBoxClass = (element: HTMLElement | null | undefined, change: boolean) => {
      if (element) {
         const unmutableClasses = 'grid my-2 p-4 rounded-xl font-medium w-full'
         const classes = change
            ? `${styles.itemInfo} ${styles.checkedItemInfo} ${unmutableClasses}`
            : `${styles.itemInfo} ${unmutableClasses}`
         element.className = classes
      }
   }

   const setAllValues = (
      priceParsed: number,
      evaluator: boolean,
      idEvaluator: string,
      verOption: boolean
   ) => {
      if (evaluator) {
         setPrice(price + priceParsed)
         if (verOption) {
            const uniqAddOns = lightBoxes.find((box) => box.state)
            uniqAddOns && setAddOns([uniqAddOns.id])
         } else setAddOns([...addOns, idEvaluator])
         ElementReffed.current.forEach((el) => {
            el.id === idEvaluator &&
               changeCheckBoxClass(el.parentElement?.parentElement?.parentElement, true)
         })
      } else {
         setPrice(price - priceParsed < minimumPrice ? minimumPrice : price - priceParsed)
         setAddOns(addOns.filter((a) => a !== idEvaluator))
         ElementReffed.current.forEach((el) => {
            el.id === idEvaluator &&
               changeCheckBoxClass(el.parentElement?.parentElement?.parentElement, false)
         })
      }
   }

   const changePrice = (
      event: React.MouseEvent<HTMLInputElement, MouseEvent>,
      value: number,
      verOption = false
   ) => {
      const checker = event.currentTarget.checked
      const currElId = event.currentTarget.id
      setAllValues(value, checker, currElId, verOption)
   }

   const checkCanBeExtra = (item: any) => {
      if ('canBeExtra' in item) return item.canBeExtra
      return true
   }

   const [addOnsHelper, setAddOnsHelper] = useState<string>('')

   useEffect(() => {
      if (singleOption) {
         const selectedBox = lightBoxes.filter((box) => box.state)
         setAddOnsHelper(selectedBox[0]?.id)
         const aditionalPrice =
            selectedBox[0]?.subTotal === undefined ? 0 : selectedBox[0]?.subTotal
         setPrice(minimumPrice + aditionalPrice)
      }
   }, [lightBoxes])

   useEffect(() => {
      singleOption && setAddOns([addOnsHelper])
   }, [addOnsHelper])

   return (
      <div className={`${styles.topAddons} static`}>
         <div className='mt-5 font-semibold'>{title}</div>
         <div className='mb-5 mt-1 ml-2 text-sm font-semibold'>{subTitle}</div>
         {addonList.map(
            (item, idx) =>
               addOnIds.includes(item.id) &&
               item.isAvailable &&
               checkCanBeExtra(item) && (
                  <div
                     key={item.id}
                     className={`${styles.itemInfo} ${
                        lightBoxes[idx].state && styles.checkedItemInfo
                     } grid my-2 p-4 rounded-xl font-medium w-full`}
                     onClick={(e) => e.target}
                  >
                     <div className='text-base'>
                        <label>{item.name}</label>
                     </div>
                     <div className='justify-center items-center w-4/5 row-start-1 row-end-3 col-start-2 h-full'>
                        <CheckBox
                           func={(event) => {
                              runLightBoxesState(idx, singleOption)
                              changePrice(event, item.price ? item.price : 0)
                           }}
                           id={item.id}
                           name={item.id}
                           value={item.price}
                           state={lightBoxes[idx].state}
                           reffed={ElementReffed}
                           reffer={ElementReffer}
                        />
                     </div>
                     <div className='text-base'>
                        {item.price !== undefined && item.price > 0 && formatPrice(item.price)}
                     </div>
                  </div>
               )
         )}
      </div>
   )
}

export default AddOns

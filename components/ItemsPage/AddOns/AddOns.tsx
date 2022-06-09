import ToppingModel from '../../../models/ToppingModel'
import SauceModel from '../../../models/SauceModel'
import styles from './AddOns.module.scss'
import { fotmatPrice } from '../../../utils/dataHelper'
import useElementRefList from '../../../hooks/useElementRefList'
import { useState } from 'react'
import { stringToArray } from '../../../utils/dataHelper'
import useMultipleStatesManager from '../../../hooks/useMultipleStatesManager'

interface Props {
   addOnIds: string[]
   title: string
   addonList: ToppingModel[] | SauceModel[]
   addOns: string[]
   setAddOns: React.Dispatch<React.SetStateAction<string[]>>
   price: number
   setPrice: React.Dispatch<React.SetStateAction<number>>
   minimumPrice: number
   boxes: string | string[] | undefined
}

interface MultipleStates {
   id: string
   subTotal: number
   state: boolean
   setState: React.Dispatch<React.SetStateAction<boolean>>
}

const AddOns = ({
   addOnIds,
   title,
   addonList,
   addOns,
   setAddOns,
   price,
   setPrice,
   minimumPrice,
   boxes,
}: Props) => {
   /* const useMultipleStatesManager = <T extends { id: string; price: number | undefined }>(
      modelList: T[]
   ) => {
      const lightBoxes: MultipleStates[] = []
      const appendedLightBoxes = (id: string, price: number, value: boolean) => {
         const [lightBox, setLightBox] = useState(value)
         const theStates: MultipleStates = {
            id: id,
            subTotal: price,
            state: lightBox,
            setState: setLightBox,
         }
         lightBoxes.push(theStates)
      }
      modelList.forEach((add) => {
         appendedLightBoxes(
            add.id,
            add.price ? add.price : 0,
            stringToArray(boxes).includes(add.id)
         )
      })
      const runLightBoxesState = (index: number) => {
         const currentState = lightBoxes[index]
         !currentState.state ? currentState.setState(true) : currentState.setState(false)
      }

      return {
         lightBoxes,
         runLightBoxesState,
      }
   } */

   const { lightBoxes, runLightBoxesState } = useMultipleStatesManager<ToppingModel | SauceModel>(
      addonList,
      boxes
   )

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

   const setAllValues = (priceParsed: number, evaluator: boolean, idEvaluator: string) => {
      if (evaluator) {
         setPrice(price + priceParsed)
         setAddOns([...addOns, idEvaluator])
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

   const changePrice = (event: React.MouseEvent<HTMLInputElement, MouseEvent>, value: number) => {
      const checker = event.currentTarget.checked
      const currElId = event.currentTarget.id
      setAllValues(value, checker, currElId)
   }

   return (
      <div className={`${styles.topAddons} static`}>
         <div className='my-5 font-semibold'>{title}</div>
         {addonList.map(
            (item, idx) =>
               addOnIds.includes(item.id) &&
               item.isAvailable && (
                  <div
                     key={item.id}
                     className={`${styles.itemInfo} ${
                        stringToArray(boxes).includes(item.id) && styles.checkedItemInfo
                     } grid my-2 p-4 rounded-xl font-medium w-full`}
                     onClick={(e) => e.target}
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
                                 runLightBoxesState(idx)
                                 changePrice(event, item.price ? item.price : 0)
                              }}
                              onChange={(e) => {}}
                              className='relative block'
                              type='checkbox'
                              id={item.id}
                              name={item.id}
                              value={item.price}
                              ref={(el) => ElementReffer(el, ElementReffed)}
                              checked={lightBoxes[idx].state}
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

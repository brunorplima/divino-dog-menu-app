import { useEffect, useState } from 'react'
import { stringToArray } from '../utils/dataHelper'

interface MultipleStates {
   id: string
   subTotal: number
   state: boolean
   setState: React.Dispatch<React.SetStateAction<boolean>>
}

const useMultipleStatesManager = <T extends { id: string; price: number | undefined }>(
   modelList: T[],
   url: string | string[] | undefined,
   setDialog: React.Dispatch<React.SetStateAction<boolean>>,
   maxAmount?: number
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
      appendedLightBoxes(add.id, add.price ? add.price : 0, stringToArray(url).includes(add.id))
   })

   const newIds = lightBoxes.map((box) => box.state && box.id).filter(Boolean) as string[]
   const runLightBoxesState = (index: number, singleOption = false) => {
      const currentId = lightBoxes[index].id
      if (singleOption) {
         const tempBoxes = [...lightBoxes]
         tempBoxes.forEach((box) => {
            box.id !== currentId ? box.setState(false) : box.setState(true)
         })
      } else if (maxAmount !== undefined) {
         const currentObj = lightBoxes[index]
         if (maxAmount <= newIds.length && !newIds.includes(currentObj.id)) {
            setDialog(true)
            return false
         }
         !currentObj.state ? currentObj.setState(true) : currentObj.setState(false)
      } else {
         const currentObj = lightBoxes[index]
         !currentObj.state ? currentObj.setState(true) : currentObj.setState(false)
      }
   }

   return {
      lightBoxes,
      runLightBoxesState,
   }
}

export default useMultipleStatesManager

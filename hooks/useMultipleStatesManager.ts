import { useState } from 'react'
import { stringToArray } from '../utils/dataHelper'

interface MultipleStates {
   id: string
   subTotal: number
   state: boolean
   setState: React.Dispatch<React.SetStateAction<boolean>>
}

const useMultipleStatesManager = <T extends { id: string; price: number | undefined }>(
   modelList: T[],
   url: string | string[] | undefined
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

   const runLightBoxesState = (index: number, singleOption = false) => {
      const currentState = lightBoxes[index]
      !currentState.state ? currentState.setState(true) : currentState.setState(false)
      if (singleOption) {
         const tempBoxes = [...lightBoxes]
         tempBoxes.forEach((box, idx) => {
            idx !== index && box.setState(false)
         })
      }
   }

   return {
      lightBoxes,
      runLightBoxesState,
   }
}

export default useMultipleStatesManager

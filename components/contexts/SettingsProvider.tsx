import { Unsubscribe } from 'firebase/firestore'
import React, { createContext, useEffect, useRef, useState } from 'react'
import SettingsModel from '../../models/SettingsModel'

interface Props {
   readonly children: React.ReactNode
}

interface SettingsContext {
   readonly settingsModel: SettingsModel | null
}

export const settingsContext = createContext<SettingsContext>({
   settingsModel: null
})

const SettingsProvider: React.FC<Props> = ({ children }) => {
   const [settingsModel, setSettingsModel] = useState<SettingsModel | null>(null)

   useEffect(() => {
      const unsubscribe = SettingsModel.listen(setSettingsModel)

      return unsubscribe
   }, [])

   return (
      <settingsContext.Provider value={{ settingsModel }}>
         {children}
      </settingsContext.Provider>
   )
}

export default SettingsProvider

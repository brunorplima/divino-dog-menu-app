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
   const [settingsModel, setSettingsModel] = useState<SettingsModel>(SettingsModel.Instance)
   const unsubscribeRef = useRef<Unsubscribe>()


   useEffect(() => {
      if (!unsubscribeRef.current) unsubscribeRef.current = SettingsModel.listen(setSettingsModel)

      return unsubscribeRef.current
   }, [settingsModel])

   return (
      <settingsContext.Provider value={{ settingsModel }}>
         {children}
      </settingsContext.Provider>
   )
}

export default SettingsProvider

import { Auth, getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { db } from '../../firebase/app'
import UserModel from '../../models/UserModel'
import { User } from '../../models/interfaces'

interface AuthContext {
   readonly user: UserModel | null
   readonly fbUser: FirebaseUser | null
   readonly auth: Auth | null
}

export const authContext = createContext<AuthContext>({
   user: null,
   fbUser: null,
   auth: null
})

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<UserModel | null>(null)
   const [fbUser, setFbUser] = useState<FirebaseUser | null>(null)
   const auth = getAuth()

   let unsubscribe = useRef(() => {})

   useEffect(() => {
      const authUnsubscribe = onAuthStateChanged(auth, async currentUser => {
         if (currentUser) setFbUser(currentUser)
         else setFbUser(null)
      })
      return authUnsubscribe
   }, [])

   useEffect(() => {
      if (fbUser) {
         unsubscribe.current = onSnapshot(doc(db, 'users', fbUser.uid), doc => {
            setUser(new UserModel(doc.data() as User))
         })
      }
      else {
         unsubscribe.current()
         unsubscribe.current = () => {}
      }
      return unsubscribe.current
   }, [fbUser])

  return (
    <authContext.Provider value={{user, fbUser, auth}}>
       {children}
    </authContext.Provider>
  )
}

export default AuthProvider

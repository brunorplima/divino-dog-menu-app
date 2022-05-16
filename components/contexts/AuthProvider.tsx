import { Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User as FirebaseUser } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { db } from '../../firebase/app'
import UserModel from '../../models/UserModel'
import { User } from '../../models/interfaces'
import { equals } from 'ramda'
import { isAdminUser } from '../../utils/modelHelper'

export type UserOrNull = UserModel | null

interface AuthContext {
   readonly user: UserOrNull
   readonly fbUser: FirebaseUser | null
   readonly auth: Auth | null
   readonly login: (email: string, password: string) => Promise<boolean>
}

export const authContext = createContext<AuthContext>({
   user: null,
   fbUser: null,
   auth: null,
   login: async () => false
})

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<UserModel | null>(null)
   const [fbUser, setFbUser] = useState<FirebaseUser | null>(null)
   const auth = getAuth()

   let unsubscribe = useRef(() => {})

   useEffect(() => {
      const authUnsubscribe = onAuthStateChanged(auth, async currentUser => {
         if (currentUser) {
            if (!equals(currentUser, fbUser)) setFbUser(currentUser)
         }
         else setFbUser(null)
      })
      return authUnsubscribe
   }, [])

   useEffect(() => {
      if (fbUser) {
         unsubscribe.current = onSnapshot(doc(db, 'users', fbUser.uid), doc => {
            const incomingUser = doc.data() as User
            if (!equals(incomingUser, user)) setUser(new UserModel(incomingUser))
         })
      }
      else {
         unsubscribe.current()
         unsubscribe.current = () => {}
      }
      return unsubscribe.current
   }, [fbUser])

   const login = async (email: string, password: string): Promise<boolean> => {
      if (auth) {
         try {
            const credentials = await signInWithEmailAndPassword(auth, email, password)
            setFbUser(credentials.user)
            const userModel = await UserModel.find(credentials.user.uid)
            setUser(userModel)
            return isAdminUser(userModel)
         }
         catch(err: any) {
            
         }
      }
      return false
   }

  return (
    <authContext.Provider value={{user, fbUser, auth, login}}>
       {children}
    </authContext.Provider>
  )
}

export default AuthProvider

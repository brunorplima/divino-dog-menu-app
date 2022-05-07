import { User } from './interfaces'
import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from 'firebase/firestore'
import Model from './Model'

export default class UserModel extends Model<User> {

   private user: User

   constructor(user: Omit<User, 'admin' | 'master'>) {
      super()
      this.user = user
   }
   
   static get PATH(): string { return 'users' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, UserModel.PATH, id))
      
      if (!docRef.exists()) return null

      const userModel = new UserModel(docRef.data() as User)

      return userModel
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, UserModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const users: UserModel[] = []
         snapshot.forEach(document => {
            const user = document.data()
            if (user.dateOfBirth) {
               user.dateOfBirth = user.dateOfBirth.toDate()
            }
            const userModel = new UserModel(user as User)
            users.push(userModel)
         })
         setFunction(users)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const users: UserModel[] = []
         snapshot.forEach(document => {
            const user = document.data()
            if (user.dateOfBirth) {
               user.dateOfBirth = user.dateOfBirth.toDate()
            }
            const userModel = new UserModel(user as User)
            users.push(userModel)
         })
         setFunction(users)
      })
      
      return unsubscribe
   }

   get id()             { return this.user.id }
   get firstName()      { return this.user.firstName }
   get lastName()       { return this.user.lastName }
   get emailAddress()   { return this.user.emailAddress }
   get phoneContact1()  { return this.user.phoneContact1 }
   get phoneContact2()  { return this.user.phoneContact2 }
   get addresses()      { return this.user.addresses }
   get dateOfBirth()    { return this.user.dateOfBirth }
   get admin()          { return this.user.admin }
   get master()         { return this.user.master }

   values() {
      return this.user
   }

   isValid() {
      const {id, firstName, lastName: secondName, emailAddress} = this.values()
      if (!id ||!firstName ||!secondName || !emailAddress) return false

      return true
   }

   modify(values: Partial<Omit<User, 'admin' | 'master'>>) {
      this.user = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.values()
      const docRef = doc(db, UserModel.PATH, id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      const { id } = this.values()

      return await deleteDoc(doc(db, UserModel.PATH, id))
   }

   toString() {
      return `${this.firstName} ${this.lastName}`
   }
}

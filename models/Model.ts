/*
   All Models must also implement the following:

   constructor(public type: T)
   static get PATH(): string
   static async find(id: string): T
   static async listenToAll(setFunction: Function): Unsubscribe
   static async listenToQuery(q: Query, setFunction: Function): Unsubscribe

*/

export default abstract class Model<T> {
   abstract values(): T
   abstract isValid(): boolean
   abstract modify(values: Partial<Omit<T, 'id'>>): void
   save(): void {}
   delete(): void {}
   abstract toString(): string
}

/*
   ChildModel template

   ``````
   import * as R from 'ramda'
   import { db } from '../firebase/app'
   import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
   import Model from './Model';

   export default class ChildModel extends Model<T> { // rename ChildModel, T

      constructor(public model: T) { // rename model
         super()
      }
      
      static get PATH(): string { return 'path' } // change path here

      static async find(id: string) {
         const docRef = await getDoc(doc(db, ChildModel.PATH, id))
         
         if (!docRef.exists()) return null

         return docRef.data() as T
      }

      static listenToAll(setFunction: Function): Unsubscribe {
         const q = query(collection(db, ChildModel.PATH))
         
         const unsubscribe = onSnapshot(q, snapshot => {
            const models: T[] = [] // rename models
            snapshot.forEach(document => models.push(document.data() as T))
            setFunction(models)
         })
         
         return unsubscribe
      }

      static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
         const unsubscribe = onSnapshot(q, snapshot => {
            const models: T[] = [] // rename models
            snapshot.forEach(document => models.push(document.data() as T))
            setFunction(models)
         })
         
         return unsubscribe
      }

      values() {
         return this.model
      }

      isValid() {
         const { id, fieldStr, fieldNum } = this.model

         if (id.length !== 13) return false

         ...

         return true
      }

      modify(values: Partial<Omit<T, 'id'>>) {
         this.model = R.mergeRight(this.model, values)
      }

      async save() {
         if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

         const { id } = this.model
         
         const docRef = doc(db, ChildModel.PATH, id)
         
         await setDoc(docRef, this.model)
      }

      async delete() {
         const { id } = this.model

         return await deleteDoc(doc(db, ChildModel.PATH, id))
      }

      toString() {
         return this.model.fieldStr
      }
   }
   
*/

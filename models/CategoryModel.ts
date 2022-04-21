import { Category } from './interfaces'
import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';

export default class CategoryModel extends Model<Category> {

   constructor(public category: Category) {
      super()
   }
   
   static get PATH(): string { return 'categories' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, CategoryModel.PATH, id))
      
      if (!docRef.exists()) return null

      return docRef.data() as Category
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, CategoryModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const categories: Category[] = []
         snapshot.forEach(document => categories.push(document.data() as Category))
         setFunction(categories)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const categories: Category[] = []
         snapshot.forEach(document => categories.push(document.data() as Category))
         setFunction(categories)
      })
      
      return unsubscribe
   }

   values() {
      return this.category
   }

   isValid() {
      const { id, name } = this.category

      if (!id || !name) return false

      if (id.length !== 13) return false

      return true
   }

   modify(values: Partial<Omit<Category, 'id'>>) {
      this.category = R.mergeRight(this.category, values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.category
      
      const docRef = doc(db, CategoryModel.PATH, id)
      
      await setDoc(docRef, this.category)
   }

   async delete() {
      const { id } = this.category

      return await deleteDoc(doc(db, CategoryModel.PATH, id))
   }

   toString() {
      return this.category.name
   }
}

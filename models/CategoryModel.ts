import { Category } from './interfaces'
import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { generateID } from '../utils/modelHelper';
import MenuItemModel from './MenuItemModel'

export default class CategoryModel extends Model<Category> {

   private category: Category

   constructor(category: Omit<Category, 'id'> | Category) {
      super()
      if (R.propOr(false, 'id', category)) this.category = category as Category
      else {
         this.category = {
            id: generateID(),
            ...category
         }
      }
   }
   
   static get PATH(): string { return 'categories' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, CategoryModel.PATH, id))
      
      if (!docRef.exists()) return null

      const categoryModel = new CategoryModel(docRef.data() as Category)

      return categoryModel
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, CategoryModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const categories: CategoryModel[] = []
         snapshot.forEach(document => {
            const categoryModel = new CategoryModel(document.data() as Category)
            categories.push(categoryModel)
         })
         setFunction(categories)
      })
      
      return unsubscribe
   }

   get id()          { return this.category.id }
   get name()        { return this.category.name }
   get listOrder()   { return this.category.listOrder }
   get isPromotion() { return this.category.isPromotion }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const categories: CategoryModel[] = []
         snapshot.forEach(document => {
            const categoryModel = new CategoryModel(document.data() as Category)
            categories.push(categoryModel)
         })
         setFunction(categories)
      })
      
      return unsubscribe
   }

   values() {
      return this.category
   }

   doesItemBelong(item: MenuItemModel): boolean {
      if (this.isPromotion) {
         return item.hasValidPromotion() || item.categoryId === this.id
      }
      return item.categoryId === this.id
   }

   isValid() {
      if (!this.id || !this.name) return false

      if (this.id.length !== 13) return false

      return true
   }

   modify(values: Partial<Omit<Category, 'id'>>) {
      this.category = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const docRef = doc(db, CategoryModel.PATH, this.id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      return await deleteDoc(doc(db, CategoryModel.PATH, this.id))
   }

   toString() {
      return this.name
   }
}

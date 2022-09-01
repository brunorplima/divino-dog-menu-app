import moment from 'moment'
import MenuItemModel from '../models/MenuItemModel'

export const priceToString = (price: number, withDecimal = true) => {
   return `$ ${withDecimal ? price.toFixed(2) : price.toFixed(0)}`
}

export const formatPrice = (unformatted: number | undefined) => {
   if (unformatted !== undefined) {
      if (String(unformatted).includes('.'))
         return `R$ ${String(unformatted).replace('.', ',')}${
            String(unformatted).split('.')[1].length === 1 ? 0 : ''
         }`
      else return `R$ ${unformatted},00`
   }
}

export const stringToArray = (urlValue: string | string[] | undefined) => {
   if (urlValue === undefined) return [] as string[]
   if (typeof urlValue === 'string') return urlValue.split('-').filter((a) => a !== '')
   else return urlValue
}
export const capitalizeFirstLetter = (word: string) =>
   word.toLowerCase().charAt(0).toUpperCase() + word.slice(1)

export const checkPromoDate = (
   item: MenuItemModel | undefined,
   serverDate?: Date | undefined
) => {
   if (item !== undefined) {
      const endDate = moment(item ? item.promoPrice?.dateLimit : 0)
      const startDate = moment(serverDate)
      const diffDate = endDate.diff(startDate, 'seconds', true) > 0
      return diffDate
   } else return false
}

export const compareWeekDaysToModel = (weekDaysModel: number[] | undefined, getDate?: Date) => {
   if (weekDaysModel === undefined) return true
   else if (weekDaysModel.length === 0) return false

   const numberDay = getDate === undefined ? new Date().getDay() : getDate.getDay()

   const definedDay = numberDay - 1 === -1 ? 7 : numberDay - 1
   return weekDaysModel.includes(definedDay)
}

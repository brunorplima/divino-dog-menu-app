import moment from 'moment'
import * as R from 'ramda'
import {
   FEBRUARY,
   APRIL,
   FRIDAY,
   JANUARY,
   MARCH,
   MONDAY,
   SATURDAY,
   SUNDAY,
   THURSDAY,
   TUESDAY,
   WEDNESDAY,
   MAY,
   JUNE,
   JULY,
   AUGUST,
   SEPTEMBER,
   OCTOBER,
   NOVEMBER,
   DECEMBER,
} from '../constants/modelsConstants'

type FormatoInput = 'f' | 'ff' | 's' | 'ss' | 'fs1' | 'fs2'

class Momento {
   private moment: moment.Moment
   static readonly FULL_MONTHS = [
      JANUARY,
      FEBRUARY,
      MARCH,
      APRIL,
      MAY,
      JUNE,
      JULY,
      AUGUST,
      SEPTEMBER,
      OCTOBER,
      NOVEMBER,
      DECEMBER,
   ]
   static readonly MONTHS = this.FULL_MONTHS.map((month) => month.substring(0, 3))
   static readonly FULL_DAYS = [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]
   static readonly DAYS = this.FULL_DAYS.map((day) => day.substring(0, 3))

   constructor(input?: moment.MomentInput) {
      this.moment = R.isNil(input) ? moment() : moment(input)
   }

   get momento() { return this.moment }

   /**
    * It returns a string date representation in portuguese in the following formats:
    * - f => 3 Abril 2020
    * - ff => 03 Abril 2020
    * - s => 3 Abr 2020
    * - ss => 03 Abr 2020
    * - fs1 => 3/4/2020
    * - fs2 => 03/04/2020
    *
    * All in the order [day, month, year]
    *
    * @param input Value from a predefined list of values that defines how the format should be
    * @returns The date format in the Portuguese language
    */
   formato(input: FormatoInput): string {
      const options: Record<FormatoInput, () => string> = {
         f:    () => `${this.getDate(false)} ${Momento.FULL_MONTHS[this.moment.month()]} ${this.moment.year()}`,
         ff:   () => `${this.getDate()} ${Momento.FULL_MONTHS[this.moment.month()]} ${this.moment.year()}`,
         s:    () => `${this.getDate(false)} ${Momento.MONTHS[this.moment.month()]} ${this.moment.year()}`,
         ss:   () => `${this.getDate()} ${Momento.MONTHS[this.moment.month()]} ${this.moment.year()}`,
         fs1:  () => `${this.getDate(false)}/${this.getMonth(false)}/${this.moment.year()}`,
         fs2:  () => `${this.getDate()}/${this.getMonth()}/${this.moment.year()}`,
      }
      return options[input]()
   }

   getDate(padded = true): string {
      const date = this.moment.date()
      if (!padded) return date.toString()
      return date < 10 ? `0${date}` : date.toString()
   }

   getDay(full = true): string {
      const day = this.moment.day()
      if (full) {
         return Momento.FULL_DAYS[day]
      } else {
         return Momento.DAYS[day]
      }
   }

   getMonth(padded = true): string {
      const month = this.moment.month() + 1
      if (!padded) return month.toString()
      return month < 10 ? `0${month}` : month.toString()
   }
}

export default Momento

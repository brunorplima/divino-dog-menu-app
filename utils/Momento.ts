import moment from "moment"
import * as R from 'ramda'

type FormatoInput = 'f' | 'ff' | 's' | 'ss' | 'fs1' | 'fs2'

class Momento {
   moment: moment.Moment
   readonly FULL_MONTHS = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
   ]
   readonly MONTHS = this.FULL_MONTHS.map(month => month.substring(0, 3))
   readonly FULL_DAYS = [
      'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
   ]
   readonly DAYS = this.FULL_DAYS.map(day => day.substring(0, 3))

   constructor(inp?: moment.MomentInput) {
      this.moment = R.isNil(inp) ? moment() : moment(inp)
   }

   get momento() { return this.moment }

   /**
    * It returns a string date representation in portuguese in the following formats:
    *   f => 3 Abril 2020
    *  ff => 03 Abril 2020
    *   s => 3 Abr 2020
    *  ss => 03 Abr 2020
    * fs1 => 3/4/2020
    * fs2 => 03/04/2020
    * 
    * All in the order [day, month, year]
    * 
    * @param input Predefined list of possible that defines how should be the format
    * @returns The date format in the Portuguese language
    */
   formato(input: FormatoInput): string {
      const options: Record<FormatoInput, () => string> = {
         f: () => `${this.getDate(false)} ${this.FULL_MONTHS[this.moment.month()]} ${this.moment.year()}`, // 3 Abril 2020
         ff: () => `${this.getDate()} ${this.FULL_MONTHS[this.moment.month()]} ${this.moment.year()}`, // 03 Abril 2020
         s: () => `${this.getDate(false)} ${this.MONTHS[this.moment.month()]} ${this.moment.year()}`, // 3 Abr 2020
         ss: () => `${this.getDate()} ${this.MONTHS[this.moment.month()]} ${this.moment.year()}`, // 03 Abr 2020
         fs1: () => `${this.getDate(false)}/${this.getMonth(false)}/${this.moment.year()}`, // 3/4/2020
         fs2: () => `${this.getDate()}/${this.getMonth()}/${this.moment.year()}`, // 03/04/2020
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
         return this.FULL_DAYS[day]
      }
      else {
         return this.DAYS[day]
      }
   }

   getMonth(padded = true): string {
      const month = this.moment.month() + 1
      if (!padded) return month.toString()
      return month < 10 ? `0${month}` : month.toString()
   }
}

export default Momento

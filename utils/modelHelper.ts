
export const generateID = () => {	  
   const size = 13
   const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
   let id = ""

   for (let i = 0; i < size; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
   }

   return id;  
}

export const generateOrderCodeNumber = (existingCodeNumbers: string[]) => {
   const possible = '0123456789'
   let codeNumber = ''

   for (let i = 1; i <= 4; i++) {
      codeNumber += possible.charAt(Math.floor(Math.random() * possible.length))
   }

   if (existingCodeNumbers.includes(codeNumber)) generateOrderCodeNumber(existingCodeNumbers)

   return codeNumber
}

import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase/app"

export const getAuthErrorMessage = (message: string) => {
   switch (message) {
      case 'Firebase: Error (auth/user-not-found).':
      case 'Firebase: Error (auth/wrong-password).':
         return 'E-mail ou senha incorretos'
      case 'Firebase: Error (auth/email-already-in-use).':
         return 'Email indisponível'
      default:
         return 'Não foi possivel completar seu login'
   }
}

export const storeFile = async (file: File, dir: string): Promise<string> => {
   const fileRef = ref(storage, `${dir}/${file.name}`)
   await uploadBytes(fileRef, file)
   const url = await getDownloadURL(fileRef)
   return url
}

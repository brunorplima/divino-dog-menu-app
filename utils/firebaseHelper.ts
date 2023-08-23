import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase/app"

export const getAuthErrorMessage = (message: string) => {
   switch (message) {
      case 'Firebase: Error (auth/user-not-found).':
      case 'Firebase: Error (auth/wrong-password).':
         return 'Incorrect email or password'
      case 'Firebase: Error (auth/email-already-in-use).':
         return 'Unavailable email'
      default:
         return 'It was not possible to complete the login'
   }
}

export const storeFile = async (file: File, dir: string): Promise<string> => {
   const fileRef = ref(storage, `${dir}/${file.name}`)
   await uploadBytes(fileRef, file)
   const url = await getDownloadURL(fileRef)
   return url
}

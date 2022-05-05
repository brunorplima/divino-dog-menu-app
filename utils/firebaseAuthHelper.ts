
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

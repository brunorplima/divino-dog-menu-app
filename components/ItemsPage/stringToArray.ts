const stringToArray = (urlValue: string | string[] | undefined) => {
   if (urlValue === undefined) return ['']
   if (typeof urlValue === 'string') return urlValue.split('-').filter((a) => a !== '')
   else return urlValue
}

export default stringToArray

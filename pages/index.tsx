import type { NextPage } from 'next'
import React, { useContext, useEffect } from 'react'
import { menuContext } from '../components/contexts/MenuProvider'

const Home: NextPage = () => {

   // It's easy peasy lemon squeezy to grab the data from the context. All we gotta do is
   // import the menuContext and pass it to the useContext hook from React. This way we don't
   // need to do the so called prop drilling, where we fetch that data from a common parent
   // of all components that need it and keep passing down to all children to get access
   // to it.
   const context = useContext(menuContext)

   /**
    * Or as you know you could do this directly:
    * const {
         menuItems,
         categories, 
         flavors,
         orders,
         sauces,
         toppings
      } = useContext(menuContext)
    */

   useEffect(() => {
      const {
         menuItems,
         categories, 
         flavors,
         orders,
         sauces,
         toppings
      } = context
      console.log(menuItems)
      console.log(categories)
      console.log(flavors)
      console.log(orders)
      console.log(sauces)
      console.log(toppings)
   }, [context])

   return (
      <div className=''>

      </div>
   )
}

export default Home

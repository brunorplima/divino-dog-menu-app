import Link from 'next/link'
import React from 'react'
import MenuItemModel from '../../../../models/MenuItemModel'

interface Props {
   children: any
   link: boolean
   item: MenuItemModel
}

function ConditionalLinkRender({ children, link, item }: Props) {
   if (link)
      return (
         <Link href={`/item?itemId=${item.id}&catId=${item.categoryId}`}>
            <a>{children}</a>
         </Link>
      )
   return <>{children}</>
}

export default ConditionalLinkRender

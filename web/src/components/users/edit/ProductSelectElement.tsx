import { InGameStoreItem } from '@prisma/client'
import React from 'react'

const ProductSelectElement = ({
    product,
    click,
    cname,
}: {
    product: InGameStoreItem
    click: Function
    cname: string
}) => {
    return (
        <div className={'flex flex-row justify-around items-center gap-2 rounded-none p-1 ' + cname}>
            <div className="w-1/4 text-center">{product.name}</div>
            <div className="w-1/4 text-center">{product.price}</div>
            <div className="w-1/4 text-center">{product.category}</div>
            <div
                className="w-1/4 text-center cursor-pointer"
                onClick={() => {
                    click()
                }}
            >
                Remove
            </div>
        </div>
    )
}

export { ProductSelectElement }

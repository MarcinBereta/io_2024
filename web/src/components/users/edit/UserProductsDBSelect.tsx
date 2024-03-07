'use client'

import React, { ChangeEvent, useState } from 'react'
import { InGameStoreItem } from '@prisma/client'
import { ProductSelectElement } from './ProductSelectElement'

const UserProductsDBSelect = ({
    updateSearch,
    startingState,
    updateSelected,
    removeSelected,
}: {
    updateSearch: (str: string) => Promise<InGameStoreItem[]>
    startingState: InGameStoreItem[]
    updateSelected: (userId: string) => Promise<void>
    removeSelected: (userId: string) => Promise<void>
}) => {
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [searchElements, setSearchElements] = useState<InGameStoreItem[]>([])
    const [selectedElements, setSelectedElements] = useState<InGameStoreItem[]>(startingState)
    const focus = () => {
        setIsOpen(true)
    }

    const typing = (ev: React.ChangeEvent<HTMLInputElement>) => {
        // setIsOpen(true)
        ev.preventDefault()
        generateListOfCategories(ev.target.value)
    }

    const blur = () => {
        setIsOpen(false)
    }

    const generateListOfCategories = async (text: string) => {
        const selectedValues = await updateSearch(text)
        setSearchElements(selectedValues)
        setSearch(text)
    }

    const addToDisplay = async (index: number) => {
        await updateSelected(searchElements[index].id)
        setSelectedElements((elements) => [...elements, searchElements[index]])
        setSearchElements((elements) => elements.filter((el) => el.id != searchElements[index].id))
    }

    const removeFromDisplay = async (index: number) => {
        await removeSelected(selectedElements[index].id)
        setSelectedElements((elements) => elements.filter((el) => el.id != selectedElements[index].id))
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                Add new product
                <input
                    value={search}
                    onFocus={focus}
                    onBlur={blur}
                    onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                        typing(ev)
                    }}
                    type="text"
                    placeholder="Search"
                    className="rounded-lg p-2 bg-gray-800 text-white focus:bg-orange-600"
                />
            </div>
            <div
                role="toolbar"
                style={
                    isOpen
                        ? {
                              maxHeight: '250px',
                              height: 'auto',
                              borderRadius: '30px',
                              padding: '2px',
                          }
                        : { display: 'none' }
                }
                onMouseDown={(ev) => {
                    ev.preventDefault()
                }}
                className="flex flex-col text-white absolute mt-16 "
            >
                {searchElements.map((element, index) => {
                    return (
                        <ProductSelectElement
                            key={index}
                            click={() => addToDisplay(index)}
                            product={element}
                            cname="hover:bg-blue-600 bg-highlight2 cursor-pointer"
                        />
                    )
                })}
            </div>
            <div className="flex flex-col">
                Products from the app
                <div className="flex flex-row justify-around items-center gap-2 rounded-none p-1">
                    <div className="w-1/4 text-center">Name</div>
                    <div className="w-1/4 text-center">Price</div>
                    <div className="w-1/4 text-center">Category</div>
                    <div className="w-1/4 text-center">Action</div>
                </div>
                {selectedElements.map((element, index) => {
                    return (
                        <ProductSelectElement
                            key={index}
                            click={() => removeFromDisplay(index)}
                            product={element}
                            cname="bg-highlight2 "
                        />
                    )
                })}
            </div>
        </div>
    )
}

export { UserProductsDBSelect }

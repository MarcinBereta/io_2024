'use client'

import { useDebounce } from '@/lib/useDebounce'
import React, { useEffect, useState } from 'react'

const SearchBar = ({ updateUsers }: { updateUsers: (search: string) => void }) => {
    const [search, setSearch] = useState<string>('')
    const debouncedSearch = useDebounce(search, 500)
    const [firstMount, setFirstMount] = useState(true)

    useEffect(() => {
        if (!firstMount) {
            if (search.match(/\s$/) == null || search.length == 0) {
                updateUsers(debouncedSearch)
            }
        }
    }, [debouncedSearch])

    useEffect(() => {
        setFirstMount(false)
    }, [])

    return (
        <div>
            <input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                type="text"
                placeholder="Search"
                className="rounded-lg p-2 bg-gray-800 text-white"
            />
        </div>
    )
}

export { SearchBar }

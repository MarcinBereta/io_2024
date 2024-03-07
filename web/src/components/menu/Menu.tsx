import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Menu = ({
    header,
    elements,
    url,
    icon,
}: {
    header: string
    url?: string
    icon: React.ReactNode
    elements?: {
        name: string
        url: string
        icon: React.ReactNode
    }[]
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [menuPadding, setMenuPadding] = useState(false)

    const toggleMenu = () => {
        setIsExpanded((prevState) => !prevState)
        if (menuPadding) {
            setTimeout(() => {
                setMenuPadding((pad) => !pad)
            }, 300)
        } else {
            setMenuPadding((pad) => !pad)
        }
    }
    const pathname = usePathname()

    return (
        <div className=" relative">
            {url ? (
                <Link className={` `} href={url}>
                    <button
                        className={`${pathname.includes(url) ? 'bg-highlight' : 'bg-transparent'} cursor-pointer outline-none p-2 ml-2 pl-2 w-full text-left rounded-xl flex flex-row items-center gap-2`}
                    >
                        {icon} {header}
                    </button>
                </Link>
            ) : elements ? (
                <>
                    <button
                        className={`${elements.filter((el) => pathname.includes(el.url)).length > 0 ? 'bg-highlight' : 'bg-transparent'} cursor-pointer outline-none p-2 ml-2 pl-2 w-full text-left rounded-xl flex flex-row justify-between`}
                        onClick={toggleMenu}
                    >
                        <div className="flex flex-row gap-2">
                            {icon} {header}
                        </div>
                        <div>{isExpanded ? '>' : 'v'}</div>
                    </button>
                    <ul
                        className={`${isExpanded ? 'menu-expanded' : 'menu-collapsed '} ${menuPadding || isExpanded ? 'pl-4 m-1' : ' '} flex flex-col `}
                    >
                        {elements.map((child, index) => (
                            <Link
                                className={`${pathname.includes(child.url) ? 'bg-highlight' : 'bg-transparent'} p-1 rounded-lg pl-2 flex flex-row items-center gap-2`}
                                href={child.url}
                                key={index}
                            >
                                {child.icon} {child.name}
                            </Link>
                        ))}
                    </ul>
                </>
            ) : null}
        </div>
    )
}

export default Menu

import { cn } from '@/lib/utils'
import Link from 'next/link'

const capitalizeFirstLetter = (s: string): string => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const ResponsiveTable = <Type extends { id: string }, Key extends keyof Type>({
    objects,
    toDisplay,
    href,
}: {
    objects: Type[]
    toDisplay: Key[]
    href: string
}) => {
    const width = `w-1/${toDisplay.length + 1}`
    return (
        <div className=" rounded-xl ml-10 mr-10 " style={{ border: '1px solid #3d4554' }}>
            <div
                style={{ borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
                className=" flex flex-row justify-around bg-highlight2"
            >
                {toDisplay.map((el, index) => {
                    return (
                        <div key={el as string} className={cn('text-white p-2 flex justify-center', width)}>
                            {capitalizeFirstLetter(el as string)}
                        </div>
                    )
                })}
                <div className={cn('text-white p-2 flex justify-center', width)}>Action</div>
            </div>

            {objects.map((obj) => {
                return (
                    <div
                        key={obj.id}
                        className="flex flex-row justify-around"
                        style={{ borderTop: '0.5px solid white' }}
                    >
                        {toDisplay.map((el) => {
                            return (
                                <div
                                    key={obj.id + (el as string)}
                                    className={cn('text-white p-2 flex justify-center', width)}
                                >
                                    {obj[el] as string}
                                </div>
                            )
                        })}
                        <Link
                            href={`${href}/${obj.id}`}
                            className={cn('p-2 flex justify-center cursor-pointer', width)}
                        >
                            Edit
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}

export { ResponsiveTable }

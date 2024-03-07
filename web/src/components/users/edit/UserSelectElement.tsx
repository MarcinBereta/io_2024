import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@prisma/client'
import React from 'react'
import { FaUser } from 'react-icons/fa'

const UserSelectElement = ({ user, click, cname }: { user: User; click: Function; cname: string }) => {
    return (
        <div
            className={'flex flex-row justify-around items-center gap-2 rounded-none p-1 ' + cname}
            onClick={() => {
                click()
            }}
        >
            <Avatar>
                <AvatarImage src={user?.image || ''} />
                <AvatarFallback className="bg-sky-500">
                    <FaUser className="text-white" />
                </AvatarFallback>
            </Avatar>
            <div>{user.email}</div>
            <div>{user.name}</div>
        </div>
    )
}

export { UserSelectElement }

'use client'
import React, { startTransition } from 'react'

import { db } from '@/lib/db'
import { deleteUser } from '@/actions/user/user'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const UserDeleteButton = ({ userId }: { userId: string }) => {
    const router = useRouter()

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        deleteUser(userId)
        startTransition(() => router.push('/admin/users/list'))
        startTransition(() => router.refresh())
    }

    return (
        <div>
            <Button onClick={handleButtonClick} className="bg-red-700 hover:bg-red-900">
                Delete user
            </Button>
        </div>
    )
}

export { UserDeleteButton }

'use client'
import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { removeUserAvatar, removeUserBorder, removeUserProvider } from '@/actions/user/user-edit'

const UserButtonSection = ({ user, accountTypes }: { user: User | null; accountTypes: string[] }) => {
    const router = useRouter()
    return (
        <div className="flex flex-row gap-x-3">
            {user?.image != null ? (
                <Button
                    onClick={() => {
                        removeUserAvatar(user?.id || '')
                        router.refresh()
                    }}
                    variant={'default'}
                    className="bg-highlight align-middle"
                >
                    Remove avatar
                </Button>
            ) : null}
            {user?.border != null ? (
                <Button
                    onClick={() => {
                        removeUserBorder(user?.id || '')
                        router.refresh()
                    }}
                    variant={'default'}
                    className="bg-highlight align-middle"
                >
                    Remove border
                </Button>
            ) : null}
            {accountTypes?.includes('google') ? (
                <Button
                    onClick={() => {
                        removeUserProvider(user?.id || '', 'google')
                        router.refresh()
                    }}
                    variant={'default'}
                    className="bg-highlight align-middle"
                >
                    Remove google connection
                </Button>
            ) : null}

            {accountTypes?.includes('facebook') ? (
                <Button
                    onClick={() => {
                        removeUserProvider(user?.id || '', 'facebook')
                        router.refresh()
                    }}
                    variant={'default'}
                    className="bg-bg-highlight align-middle"
                >
                    Remove facebook connection
                </Button>
            ) : null}
        </div>
    )
}

export { UserButtonSection }

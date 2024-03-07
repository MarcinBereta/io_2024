'use client'
import React from 'react'
import * as z from 'zod'
import { useTransition, useState } from 'react'
import { UserStatsSchema } from '@/schemas'
import { UserStats } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { editUserStatistics } from '@/actions/user/user-edit'
import { FormGenerator } from '@/components/forms/formGenerator'

const UserStatsEdit = ({ userStats }: { userStats: UserStats | null }) => {
    const router = useRouter()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof UserStatsSchema>) => {
        startTransition(() => {
            editUserStatistics(values, userStats?.user_id || '')
                .then((data) => {
                    if (data.error) {
                        setError(data.error)
                    }
                    if (data.success) {
                        router.refresh()
                        setSuccess(data.success)
                    }
                })
                .catch(() => setError('Something went wrong!'))
        })
    }

    return (
        <FormGenerator
            schema={UserStatsSchema}
            onSubmit={onSubmit}
            defaultValues={{
                lives: userStats?.lives || 5,
                diamonds: userStats?.diamonds || 0,
                gold: userStats?.gold || 0,
                games_1vs1: userStats?.games_1vs1 || 0,
                games_2vs2: userStats?.games_2vs2 || 0,
                bot_games: userStats?.bot_games || 0,
            }}
            numberOfColumns={2}
            error={error}
            success={success}
            isPending={isPending}
            inputTypes={{
                lives: 'number',
                diamonds: 'number',
                gold: 'number',
                games_1vs1: 'number',
                games_2vs2: 'number',
                bot_games: 'number',
            }}
            translations={{
                lives: 'Lives',
                diamonds: 'Diamonds',
                gold: 'Gold',
                games_1vs1: 'Games 1vs1',
                games_2vs2: 'Games 2vs2',
                bot_games: 'Bot games',
            }}
        />
    )
}

export { UserStatsEdit }

'use client'
import * as z from 'zod'
import { useTransition, useState } from 'react'
import { UserLeagueSchema } from '@/schemas'
import { UserLeague } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { editUserLeague } from '@/actions/user/user-edit'
import { FormGenerator } from '@/components/forms/formGenerator'

const UserLeagueEdit = ({ userLeague }: { userLeague: UserLeague | null }) => {
    const router = useRouter()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof UserLeagueSchema>) => {
        startTransition(() => {
            editUserLeague(values, userLeague?.user_id || '')
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
            schema={UserLeagueSchema}
            defaultValues={{
                elo: userLeague?.elo || 1000,
                elo_2vs2: userLeague?.elo_2vs2 || 1000,
                games_played: userLeague?.games_played || 0,
                games_played_2vs2: userLeague?.games_played_2vs2 || 0,
            }}
            inputTypes={{
                elo: 'number',
                elo_2vs2: 'number',
                games_played: 'number',
                games_played_2vs2: 'number',
            }}
            onSubmit={onSubmit}
            error={error}
            success={success}
            isPending={isPending}
            translations={{
                elo: 'Elo',
                elo_2vs2: 'Elo 2vs2',
                games_played: 'Games played',
                games_played_2vs2: 'Games 2vs2',
            }}
        />
    )
}

export { UserLeagueEdit }

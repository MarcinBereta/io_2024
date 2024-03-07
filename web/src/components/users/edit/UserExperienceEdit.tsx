'use client'
import * as z from 'zod'
import { useTransition, useState } from 'react'
import { UserExperienceSchema } from '@/schemas'
import { UserExperience } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { editUserExperience } from '@/actions/user/user-edit'
import { FormGenerator } from '@/components/forms/formGenerator'

const UserExperienceEdit = ({ userExperience }: { userExperience: UserExperience | null }) => {
    const router = useRouter()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof UserExperienceSchema>) => {
        startTransition(() => {
            editUserExperience(values, userExperience?.user_id || '')
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
            schema={UserExperienceSchema}
            defaultValues={{
                xp: userExperience?.xp || 0,
                speed: userExperience?.speed || 0,
                accuracy: userExperience?.accuracy || 0,
                agility: userExperience?.agility || 0,
                observation: userExperience?.observation || 0,
                judgment: userExperience?.judgment || 0,
                memory: userExperience?.memory || 0,
            }}
            inputTypes={{
                xp: 'number',
                speed: 'number',
                accuracy: 'number',
                agility: 'number',
                observation: 'number',
                judgment: 'number',
                memory: 'number',
            }}
            onSubmit={onSubmit}
            error={error}
            success={success}
            isPending={isPending}
            translations={{
                xp: 'Xp',
                speed: 'Speed',
                accuracy: 'Accuracy',
                agility: 'Agility',
                observation: 'Observation',
                judgment: 'Judgment',
                memory: 'Memory',
            }}
        />
    )
}

export { UserExperienceEdit }

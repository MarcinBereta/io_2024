'use client'
import * as z from 'zod'
import { useTransition, useState } from 'react'
import { UserSettingsSchema } from '@/schemas'
import { UserSettings } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { editUserSettings } from '@/actions/user/user-edit'
import { FormGenerator } from '@/components/forms/formGenerator'

const UserSettingsEdit = ({ userSettings }: { userSettings: UserSettings | null }) => {
    const router = useRouter()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof UserSettingsSchema>) => {
        startTransition(() => {
            editUserSettings(values, userSettings?.user_id || '')
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
            schema={UserSettingsSchema}
            defaultValues={{
                premium_avatar: userSettings?.premium_avatar || false,
                premium_border: userSettings?.premium_border || false,
                ad_disabled: userSettings?.ad_disabled || false,
            }}
            inputTypes={{
                premium_avatar: 'boolean',
                premium_border: 'boolean',
                ad_disabled: 'boolean',
            }}
            onSubmit={onSubmit}
            error={error}
            success={success}
            isPending={isPending}
            translations={{
                premium_avatar: 'Premium avatar',
                premium_border: 'Premium border',
                ad_disabled: 'Ad disabled',
            }}
        />
    )
}

export { UserSettingsEdit }

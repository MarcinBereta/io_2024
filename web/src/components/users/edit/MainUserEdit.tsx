'use client'
import * as z from 'zod'
import { useTransition, useState } from 'react'
import { MainUserEditSchema } from '@/schemas'
import { User, UserRole } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { editUserMain } from '@/actions/user/user-edit'
import { FormGenerator } from '@/components/forms/formGenerator'

const MainUserEdit = ({ user }: { user: User | null }) => {
    const router = useRouter()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof MainUserEditSchema>) => {
        startTransition(() => {
            editUserMain(values, user?.id || '')
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
            schema={MainUserEditSchema}
            onSubmit={onSubmit}
            defaultValues={{
                name: user?.name,
                email: user?.email,
                password: '',
                role: user?.role,
            }}
            error={error}
            success={success}
            isPending={isPending}
            inputTypes={{
                name: 'text',
                email: 'email',
                password: 'password',
                role: 'select',
            }}
            selectValues={{
                role: {
                    admin: UserRole.ADMIN,
                    user: UserRole.USER,
                },
            }}
            translations={{
                name: 'Name',
                email: 'Email',
                password: 'Password',
            }}
        />
    )
}

export { MainUserEdit }

'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

type SocialLogin = {
    google?: boolean
    facebook?: boolean
}

export const Social = ({ google = false, facebook = false }: SocialLogin) => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')

    const onClick = (provider: 'google' | 'facebook') => {
        signIn(provider, {
            callbackUrl: '/setup/provider?callbackUrl=' + callbackUrl,
        })
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                style={{
                    backgroundColor: google ? 'lightgreen' : 'white',
                }}
                onClick={() => {
                    if (!google) onClick('google')
                }}
            >
                <FcGoogle className="h-5 w-5" />
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                style={{
                    backgroundColor: facebook ? 'lightgreen' : 'white',
                }}
                onClick={() => {
                    if (!facebook) onClick('facebook')
                }}
            >
                <FaFacebook className="h-5 w-5" />
            </Button>
        </div>
    )
}

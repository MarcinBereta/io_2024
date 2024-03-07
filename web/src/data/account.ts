import { db } from '@/lib/db'

export const getAccountByUserId = async (userId: string) => {
    try {
        const user = db.account.findFirst({
            where: {
                id: userId,
            },
        })
        return user
    } catch {
        return null
    }
}

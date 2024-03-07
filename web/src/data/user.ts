import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
            include: {
                accounts: true,
            },
        });
        return user;
    } catch (err) {
        return null;
    }
};

export const getUserIdByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return user;
    } catch (err) {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
            include: {
                accounts: true,
            },
        });
        return user;
    } catch {
        return null;
    }
};

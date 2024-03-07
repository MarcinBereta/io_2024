import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
declare global {
    var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || prisma

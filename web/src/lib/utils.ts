import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const calculatePercentageGrowth = (prev: number, now: number) => {
    if (prev == 0) return now * 100
    if (now == 0) return -prev * 100
    const diff = Math.abs(now - prev)
    const percentage = (diff / prev) * 100
    return percentage.toFixed(2)
}

export const formatEntires = (count: number): string => {
    if (count > 1000000) {
        return `${(count / 1000000).toFixed(2)}M`
    }
    if (count > 1000) {
        return `${(count / 1000).toFixed(2)}K`
    }
    return count.toString()
}

'use client'

import React from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'

const FormGenerator = ({
    schema,
    onSubmit,
    defaultValues,
    numberOfColumns = 2,
    error,
    success,
    isPending,
    translations,
    selectValues,
    inputTypes,
}: {
    schema: z.Schema
    onSubmit: (values: z.infer<typeof schema>) => void
    defaultValues: z.infer<typeof schema>
    numberOfColumns?: number
    error?: string | undefined
    success?: string | undefined
    isPending?: boolean
    names?: keyof z.infer<typeof schema>[]
    translations?: {
        [key: keyof z.infer<typeof schema>]: string
    }
    selectValues?: {
        [key2: string]: { [key: keyof z.infer<typeof schema>]: string }
    }
    inputTypes: {
        [key: keyof z.infer<typeof schema>]: string
    }
}) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
    })

    const inputWidth = `lg:w-${numberOfColumns}-col-input`
    const generateFormControl = (name: keyof z.infer<typeof schema>) => {
        switch (inputTypes[name]) {
            case 'text':
            case 'email':
            case 'password':
                return (
                    <FormField
                        key={name as string}
                        control={form.control}
                        name={name as string}
                        render={({ field }) => (
                            <FormItem className={cn('w-full ', inputWidth)}>
                                <FormLabel>{translations != undefined ? translations[name] : ''}</FormLabel>
                                <FormControl>
                                    <Input
                                        type={inputTypes[name]}
                                        {...field}
                                        placeholder="John Doe"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )

            case 'number':
                return (
                    <FormField
                        key={name as string}
                        control={form.control}
                        name={name as string}
                        render={({ field }) => (
                            <FormItem className={cn('w-full', inputWidth)}>
                                <FormLabel>{translations != undefined ? translations[name] : ''}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} placeholder="John Doe" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )
            case 'boolean':
                return (
                    <FormField
                        key={name as string}
                        control={form.control}
                        name={name as string}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full my-2">
                                <div className="space-y-0.5">
                                    <FormLabel>{translations != undefined ? translations[name] : ''}</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        disabled={isPending}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )
            case 'select':
                return (
                    <FormField
                        key={name as string}
                        control={form.control}
                        name={name as string}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{translations != undefined ? translations[name] : ''}</FormLabel>
                                <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {selectValues == undefined
                                            ? null
                                            : Object.keys(selectValues[name as string]).map((key) => {
                                                  return (
                                                      <SelectItem key={key} value={selectValues[name as string][key]}>
                                                          {key}
                                                      </SelectItem>
                                                  )
                                              })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )
            default:
                return <div></div>
        }
    }

    const generateFormFields = (): React.ReactNode[] => {
        let fields: React.ReactNode[] = []

        if (defaultValues != undefined) {
            Object.keys(defaultValues).map((key) => {
                fields.push(generateFormControl(key as keyof z.infer<typeof schema>))
            })
        }

        return fields
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex-row flex flex-wrap gap-x-2">{generateFormFields()}</div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button disabled={isPending} type="submit">
                    Save
                </Button>
            </form>
        </Form>
    )
}

export { FormGenerator }

// components/ui/multi-select.tsx
'use client'

import * as React from 'react'
import { Check, X, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export type OptionType = {
    label: string
    value: string
}

interface MultiSelectProps {
    options: OptionType[]
    selected: string[]
    onChange: React.Dispatch<React.SetStateAction<string[]>>
    className?: string
    placeholder?: string
}

function MultiSelect({
    options,
    selected,
    onChange,
    className,
    placeholder = 'Pilih item...',
    ...props
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item))
    }

    return (
        <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex gap-1 flex-wrap">
                        {selected.length > 0 ? (
                            options
                                .filter((option) =>
                                    selected.includes(option.value)
                                )
                                .map((option) => (
                                    <Badge
                                        variant="secondary"
                                        key={option.value}
                                        className="mr-1 mb-1"
                                        onClick={(e) => {
                                            e.stopPropagation() // Mencegah popover membuka/menutup
                                            handleUnselect(option.value)
                                        }}
                                    >
                                        {option.label}
                                        <X className="ml-1 h-4 w-4" />
                                    </Badge>
                                ))
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Cari..." />
                    <CommandList>
                        <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selected.includes(
                                    option.value
                                )
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                handleUnselect(option.value)
                                            } else {
                                                onChange([
                                                    ...selected,
                                                    option.value,
                                                ])
                                            }
                                            setOpen(true)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                isSelected
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { MultiSelect }

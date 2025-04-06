import { useEffect, useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSubBlockValue } from '../hooks/use-sub-block-value'

interface DropdownProps {
  options:
    | Array<string | { label: string; id: string }>
    | (() => Array<string | { label: string; id: string }>)
  defaultValue?: string
  blockId: string
  subBlockId: string
}

export function Dropdown({ options, defaultValue, blockId, subBlockId }: DropdownProps) {
  const [value, setValue] = useSubBlockValue<string>(blockId, subBlockId, true)
  const [storeInitialized, setStoreInitialized] = useState(false)

  // Evaluate options if it's a function
  const evaluatedOptions = useMemo(() => {
    return typeof options === 'function' ? options() : options
  }, [options])

  const getOptionValue = (option: string | { label: string; id: string }) => {
    return typeof option === 'string' ? option : option.id
  }

  const getOptionLabel = (option: string | { label: string; id: string }) => {
    return typeof option === 'string' ? option : option.label
  }

  // Get the default option value (first option or provided defaultValue)
  const defaultOptionValue = useMemo(() => {
    if (defaultValue !== undefined) {
      return defaultValue
    }

    if (evaluatedOptions.length > 0) {
      return getOptionValue(evaluatedOptions[0])
    }

    return undefined
  }, [defaultValue, evaluatedOptions, getOptionValue])

  // Mark store as initialized on first render
  useEffect(() => {
    setStoreInitialized(true)
  }, [])

  // Only set default value once the store is confirmed to be initialized
  // and we know the actual value is null/undefined (not just loading)
  useEffect(() => {
    if (
      storeInitialized &&
      (value === null || value === undefined) &&
      defaultOptionValue !== undefined
    ) {
      setValue(defaultOptionValue)
    }
  }, [storeInitialized, value, defaultOptionValue, setValue])

  // Calculate the effective value to use in the dropdown
  const effectiveValue = useMemo(() => {
    // If we have a value from the store, use that
    if (value !== null && value !== undefined) {
      return value
    }

    // Only return defaultOptionValue if store is initialized
    if (storeInitialized) {
      return defaultOptionValue
    }

    // While store is loading, don't use any value
    return undefined
  }, [value, defaultOptionValue, storeInitialized])

  // Handle the case where evaluatedOptions changes and the current selection is no longer valid
  const isValueInOptions = useMemo(() => {
    if (!effectiveValue || evaluatedOptions.length === 0) return false
    return evaluatedOptions.some((opt) => getOptionValue(opt) === effectiveValue)
  }, [effectiveValue, evaluatedOptions, getOptionValue])

  return (
    <Select
      value={isValueInOptions ? effectiveValue : undefined}
      onValueChange={(newValue) => setValue(newValue)}
    >
      <SelectTrigger className="text-left">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent className="max-h-48">
        {evaluatedOptions.map((option) => (
          <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

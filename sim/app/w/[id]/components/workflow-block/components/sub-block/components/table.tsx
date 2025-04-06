import { useEffect, useMemo, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { checkEnvVarTrigger, EnvVarDropdown } from '@/components/ui/env-var-dropdown'
import { formatDisplayText } from '@/components/ui/formatted-text'
import { Input } from '@/components/ui/input'
import { checkTagTrigger, TagDropdown } from '@/components/ui/tag-dropdown'
import { cn } from '@/lib/utils'
import { useSubBlockValue } from '../hooks/use-sub-block-value'

interface TableProps {
  columns: string[]
  blockId: string
  subBlockId: string
}

interface TableRow {
  id: string
  cells: Record<string, string>
}

export function Table({ columns, blockId, subBlockId }: TableProps) {
  const [value, setValue] = useSubBlockValue(blockId, subBlockId)

  // Create refs for input elements
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  // Ensure value is properly typed and initialized
  const rows = useMemo(() => {
    if (!Array.isArray(value)) {
      return [
        {
          id: crypto.randomUUID(),
          cells: Object.fromEntries(columns.map((col) => [col, ''])),
        },
      ]
    }
    return value as TableRow[]
  }, [value, columns])

  // Add state for managing dropdowns
  const [activeCell, setActiveCell] = useState<{
    rowIndex: number
    column: string
    showEnvVars: boolean
    showTags: boolean
    cursorPosition: number
    searchTerm: string
    activeSourceBlockId: string | null
    element?: HTMLElement | null
  } | null>(null)

  // Sync overlay scroll with input scroll
  useEffect(() => {
    if (activeCell) {
      const cellKey = `${activeCell.rowIndex}-${activeCell.column}`
      const input = inputRefs.current.get(cellKey)
      const overlay = document.querySelector(`[data-overlay="${cellKey}"]`) as HTMLElement

      if (input && overlay) {
        const handleScroll = () => {
          overlay.scrollLeft = input.scrollLeft
        }

        input.addEventListener('scroll', handleScroll)
        return () => {
          input.removeEventListener('scroll', handleScroll)
        }
      }
    }
  }, [activeCell])

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const updatedRows = [...rows].map((row, idx) =>
      idx === rowIndex
        ? {
            ...row,
            cells: { ...row.cells, [column]: value },
          }
        : row
    )

    if (rowIndex === rows.length - 1 && value !== '') {
      updatedRows.push({
        id: crypto.randomUUID(),
        cells: Object.fromEntries(columns.map((col) => [col, ''])),
      })
    }

    setValue(updatedRows)
  }

  const handleDeleteRow = (rowIndex: number) => {
    if (rows.length === 1) return
    setValue(rows.filter((_, index) => index !== rowIndex))
  }

  const renderHeader = () => (
    <thead>
      <tr className="border-b">
        {columns.map((column, index) => (
          <th
            key={column}
            className={cn(
              'px-4 py-2 text-left text-sm font-medium',
              index < columns.length - 1 && 'border-r'
            )}
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  )

  const renderCell = (row: TableRow, rowIndex: number, column: string, cellIndex: number) => {
    const cellValue = row.cells[column] || ''
    const cellKey = `${rowIndex}-${column}`

    return (
      <td
        key={`${row.id}-${column}`}
        className={cn('p-1 relative', cellIndex < columns.length - 1 && 'border-r')}
      >
        <div className="relative w-full">
          <Input
            ref={(el) => {
              if (el) inputRefs.current.set(cellKey, el)
            }}
            value={cellValue}
            placeholder={column}
            onChange={(e) => {
              const newValue = e.target.value
              const cursorPosition = e.target.selectionStart ?? 0

              handleCellChange(rowIndex, column, newValue)

              // Check for triggers
              const envVarTrigger = checkEnvVarTrigger(newValue, cursorPosition)
              const tagTrigger = checkTagTrigger(newValue, cursorPosition)

              setActiveCell({
                rowIndex,
                column,
                showEnvVars: envVarTrigger.show,
                showTags: tagTrigger.show,
                cursorPosition,
                searchTerm: envVarTrigger.show ? envVarTrigger.searchTerm : '',
                activeSourceBlockId: null,
                element: e.target,
              })
            }}
            onFocus={(e) => {
              setActiveCell({
                rowIndex,
                column,
                showEnvVars: false,
                showTags: false,
                cursorPosition: 0,
                searchTerm: '',
                activeSourceBlockId: null,
                element: e.target,
              })
            }}
            onBlur={() => {
              setTimeout(() => {
                setActiveCell(null)
              }, 200)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setActiveCell(null)
              }
            }}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-transparent caret-foreground placeholder:text-muted-foreground/50 w-full"
          />
          <div
            data-overlay={cellKey}
            className="absolute inset-0 pointer-events-none px-3 flex items-center text-sm bg-transparent overflow-hidden"
          >
            <div className="whitespace-pre">{formatDisplayText(cellValue)}</div>
          </div>
        </div>
      </td>
    )
  }

  const renderDeleteButton = (rowIndex: number) =>
    rows.length > 1 && (
      <td className="w-0 p-0">
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 h-8 w-8 absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => handleDeleteRow(rowIndex)}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </td>
    )

  return (
    <div className="relative">
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          {renderHeader()}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className="border-t group relative">
                {columns.map((column, cellIndex) => renderCell(row, rowIndex, column, cellIndex))}
                {renderDeleteButton(rowIndex)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeCell?.element && (
        <>
          <EnvVarDropdown
            visible={activeCell.showEnvVars}
            onSelect={(newValue) => {
              handleCellChange(activeCell.rowIndex, activeCell.column, newValue)
              setActiveCell(null)
            }}
            searchTerm={activeCell.searchTerm}
            inputValue={rows[activeCell.rowIndex].cells[activeCell.column] || ''}
            cursorPosition={activeCell.cursorPosition}
            onClose={() => {
              setActiveCell((prev) => (prev ? { ...prev, showEnvVars: false } : null))
            }}
            className="w-[200px] absolute"
          />
          <TagDropdown
            visible={activeCell.showTags}
            onSelect={(newValue) => {
              handleCellChange(activeCell.rowIndex, activeCell.column, newValue)
              setActiveCell(null)
            }}
            blockId={blockId}
            activeSourceBlockId={activeCell.activeSourceBlockId}
            inputValue={rows[activeCell.rowIndex].cells[activeCell.column] || ''}
            cursorPosition={activeCell.cursorPosition}
            onClose={() => {
              setActiveCell((prev) =>
                prev ? { ...prev, showTags: false, activeSourceBlockId: null } : null
              )
            }}
            className="w-[200px] absolute"
          />
        </>
      )}
    </div>
  )
}

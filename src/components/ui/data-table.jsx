import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import Input from './input'
import Pagination from './pagination'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table'
import { useDebounce } from '@/hooks/use.debounce'

const DataTable = ({
  data = [],
  columns = [],
  totalCount = 0,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  currentPage = 1,
  onPageChange,
  onSearch,
  onSort,
  onPageSizeChange,
  loading = false,
  searchPlaceholder = 'Search...',
  className = '',
  serverSort = false
}) => {
  const [sorting, setSorting] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const searchQueryDebounced = useDebounce(searchQuery, 750)

  useEffect(() => {
    onSearch?.(searchQueryDebounced)
  }, [searchQueryDebounced])

  useEffect(() => {
    if (serverSort && sorting.length) {
      const { id, desc } = sorting[0]
      onSort?.({ field: id, direction: desc ? 'desc' : 'asc' })
    }
  }, [sorting])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    },
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: serverSort
  })

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top bar: Search + per page */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="w-full max-w-sm">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-white" />}
          />
        </div>

        <div className="flex items-center gap-2 space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Rows per page:</span>
            <select
              className={`flex w-14 items-center justify-between rounded-lg border border-indigo-500/20 bg-slate-800/50 p-2 text-left text-xs text-white backdrop-blur-sm transition-all duration-200 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none md:text-sm ${loading ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500/30'} `}
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} hover={false}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="relative">
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ChevronUp className={`h-3 w-3 ${header.column.getIsSorted() === 'asc' ? 'text-indigo-400' : 'text-gray-500'}`} />
                            <ChevronDown
                              className={`-mt-1 h-3 w-3 ${header.column.getIsSorted() === 'desc' ? 'text-indigo-400' : 'text-gray-500'}`}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}

      <div className="flex justify-center">
        <div className="text-sm text-gray-400">
          Showing {data.length} of {totalCount} results.
        </div>
      </div>
    </div>
  )
}

export default DataTable

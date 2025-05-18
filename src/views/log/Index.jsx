import './log.css'

import React, { useEffect, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import { getLogs } from '@/api/log'
import toast from 'react-hot-toast'

const Index = () => {
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [typeFilter, setTypeFilter] = useState('error') // error, combined
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      try {
        const { logs } = await getLogs({ type: typeFilter, date: dateFilter })
        setData(logs)
      } catch (error) {
        console.error('Failed to fetch logs:', error)
        setData([])
        toast.error(error?.data?.message || 'Failed to fetch logs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [dateFilter, typeFilter])

  const columnHelper = createColumnHelper()
  const columns = [
    columnHelper.accessor('timestamp', {
      header: 'Time',
      cell: (info) => format(parseISO(info.getValue()), 'HH:mm:ss')
    }),
    columnHelper.accessor('level', {
      header: 'Level',
      cell: (info) => <span className={`badge ${info.getValue() === 'error' ? 'badge--danger' : 'badge--info'}`}>{info.getValue()}</span>
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('method', {
      header: 'Method',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('url', {
      header: 'URL',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('error', {
      header: 'Error',
      cell: (info) => info.getValue()
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="table__actions">
          <button className="table__btn btn-secondary" onClick={() => handleViewDetails(info.row.original)}>
            <i className="bx bx-plus-circle"></i>
          </button>
        </div>
      )
    })
  ]

  const [expandedLog, setExpandedLog] = useState(null)
  const handleViewDetails = (log) => {
    setExpandedLog(expandedLog && expandedLog.timestamp === log.timestamp ? null : log)
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 50
      }
    }
  })

  return (
    <>
      <div className="content__header">
        <h1>Dashboard</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb__item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb__item active">Logs</li>
        </ol>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="card__header flex">
          <h3>System Logs</h3>
          <div className="flex gap-2">
            <div className="form-group">
              <select defaultValue={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="form-select" disabled={isLoading}>
                <option value="error">Error</option>
                <option value="combined">Combined</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="date"
                id="date"
                disabled={isLoading}
                className="form-control"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="loading-state">
              <i className="bx bx-loader-circle bx-spin"></i>
              <p>Loading logs...</p>
            </div>
          ) : data?.logs?.length === 0 ? (
            <div className="empty-state">
              <i className="bx bx-file"></i>
              <p>No logs found for the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="table w-full min-w-[650px]">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                        >
                          <span className="table-header-sort">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className="bx bx-chevron-up ml-2"></i>,
                              desc: <i className="bx bx-chevron-down ml-2"></i>
                            }[header.column.getIsSorted()] ?? null}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                      {expandedLog && expandedLog.timestamp === row.original.timestamp && (
                        <tr className="bg-gray-50">
                          <td colSpan={columns.length} className="p-4">
                            <div className="stack-trace">
                              <h4 className="font-medium mb-2">Stack Trace</h4>
                              <div className="overflow-x-auto">
                                <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre">{row.original.stack}</pre>
                              </div>
                              {row.original.body && (
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2">Request Body</h4>
                                  <div className="overflow-x-auto">
                                    <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre">{JSON.stringify(row.original.body, null, 2)}</pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card__footer p-4">
          <div className="flex items-center justify-between">
            <div className="pagination-info">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of {data.length} logs
            </div>

            <div className="pagination-controls flex items-center gap-2">
              <button className="btn table__btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <i className="bx bx-chevron-left"></i>
              </button>
              <span className="current-page">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button className="btn table__btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <i className="bx bx-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index

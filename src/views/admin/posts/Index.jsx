import { deletePost, getPosts } from '@/api/post'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import React from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { useDebounce } from '@/hooks/use.debounce'
import './post.css'
import { Link } from 'react-router-dom'

const Index = () => {
  const [data, setData] = useState({ posts: [], total: 0 })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 1000)
  const [sort, setSort] = useState('ASC')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPost, setExpandedPost] = useState(null)

  const columnHelper = createColumnHelper()
  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <span className={`badge ${info.getValue() === 'pending' ? 'badge--danger' : 'badge--info'}`}>{info.getValue()}</span>
    }),
    columnHelper.accessor('excerpt', {
      header: 'Excerpt',
      cell: (info) => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor('author.name', {
      header: 'Author',
      cell: (info) => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: (info) => {
        const row = info.row.original
        return (
          <div className="table__actions">
            <button className="table__btn table__btn--view" onClick={() => setExpandedPost(expandedPost?.id === row.id ? null : row)}>
              <i className={`bx bx-chevron-${expandedPost?.id === row.id ? 'down' : 'right'}`}></i>
            </button>
            <button className="table__btn table__btn--edit">
              <i className="bx bx-edit"></i>
            </button>
            <button className="table__btn table__btn--delete" onClick={() => handleDeletePost(row.id)}>
              <i className="bx bx-trash"></i>
            </button>
          </div>
        )
      },
      enableSorting: false
    })
  ]

  const handleDeletePost = async (id) => {
    setIsLoading(true)
    try {
      await deletePost(id)
      await fetchPosts()
      toast.success('Deleted post')
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setData({ posts: [], total: 0 })
      toast.error(error?.data?.message || 'Failed to delete posts')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const { posts, total } = await getPosts({
        page,
        limit,
        query: debouncedQuery,
        sort
      })
      setData({ posts, total })
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setData({ posts: [], total: 0 })
      toast.error(error?.data?.message || 'Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, debouncedQuery, sort])

  useEffect(() => {
    fetchPosts()
  }, [page, limit, sort, debouncedQuery, fetchPosts])

  useEffect(() => {
    setPage(1)
  }, [debouncedQuery])

  const table = useReactTable({
    data: data.posts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit
      }
    },
    onPaginationChange: (updater) => {
      const pagination = updater({
        pageIndex: page - 1,
        pageSize: limit
      })
      setPage(pagination.pageIndex + 1)
      setLimit(pagination.pageSize)
    },
    manualPagination: true,
    pageCount: Math.ceil((data.total || 0) / limit)
  })

  const handleSearchChange = (e) => {
    setQuery(e.target.value)
  }

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value))
    setPage(1)
  }

  const handleSortToggle = () => {
    setSort(sort === 'ASC' ? 'DESC' : 'ASC')
  }

  return (
    <>
      <div className="content__header">
        <h1>Dashboard</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb__item">
            <Link to={'/dashboard'}>Home</Link>
          </li>
          <li className="breadcrumb__item active">Posts</li>
        </ol>
      </div>
      <div className="card">
        <div className="card__header">
          <h3>Posts</h3>
          <div className="filter-controls">
            <div className="form-group">
              <input
                type="search"
                placeholder="Search posts..."
                value={query}
                onChange={handleSearchChange}
                className="form-control"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <select value={limit} onChange={handleLimitChange} className="form-select" disabled={isLoading}>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
            <div className="form-group">
              <button onClick={handleSortToggle} className="btn btn-secondary" disabled={isLoading}>
                <i className={`bx ${sort === 'ASC' ? 'bx-sort-up' : 'bx-sort-down'}`}></i>
                {sort === 'ASC' ? 'Ascending' : 'Descending'}
              </button>
            </div>

            <div className="form-group">
              <button className="btn btn-primary">
                <i className="bx bx-plus"></i> New Post
              </button>
            </div>
          </div>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="loading-state">
              <i className="bx bx-loader-circle bx-spin"></i>
              <p>Loading posts...</p>
            </div>
          ) : data?.posts?.length === 0 ? (
            <div className="empty-state">
              <i className="bx bx-file"></i>
              <p>No posts found.</p>
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
                          onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
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
                      {expandedPost && expandedPost.id === row.original.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={columns.length} className="p-4">
                            <div className="post-detail">
                              <h4 className="font-medium mb-2">Content</h4>
                              <div className="overflow-x-auto">
                                <pre>{row.original.content}</pre>
                              </div>
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
              {data?.posts?.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, (page - 1) * limit + data?.posts?.length)} of{' '}
              {data.total || 0}
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

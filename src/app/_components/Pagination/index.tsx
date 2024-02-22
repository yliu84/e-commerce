import React from 'react'

import { Chevron } from '../Chevron'

import classes from './index.module.scss'

export const Pagination: React.FC<{
  page: number
  totalPages: number
  onClick: (page: number) => void
  className?: string
}> = props => {
  const { page, totalPages, onClick, className } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const handleClick = (newPage: number) => {
    window.scrollTo(0, 0)
    onClick(newPage)
  }

  return (
    <div className={[classes.pagination, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={classes.button}
        disabled={page === 1}
        onClick={() => handleClick(1)}
      >
        First
      </button>
      <button
        type="button"
        className={classes.button}
        disabled={!hasPrevPage}
        onClick={() => {
          handleClick(page - 1)
        }}
      >
        <Chevron rotate={90} className={classes.icon} />
      </button>
      <div className={classes.pageRange}>
        <span className={classes.pageRangeLabel}>
          Page {page} of {totalPages}
        </span>
      </div>
      <button
        type="button"
        className={classes.button}
        disabled={!hasNextPage}
        onClick={() => {
          handleClick(page + 1)
        }}
      >
        <Chevron rotate={-90} className={classes.icon} />
      </button>
      <button
        type="button"
        className={classes.button}
        disabled={page === totalPages}
        onClick={() => {
          handleClick(totalPages)
        }}
      >
        Last
      </button>
    </div>
  )
}

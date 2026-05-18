import type { ReactNode } from 'react'
import './DataTable.css'

type DataTableProps = {
  children: ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  const classes = ['data-table', className].filter(Boolean).join(' ')
  return <table className={classes}>{children}</table>
}

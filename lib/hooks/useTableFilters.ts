"use client"

import { useMemo, useState, useCallback } from "react"
import type { ComparisonRow } from "../types"

export type FilterType = "all" | "mismatches" | "missing" | "perfect" | "duplicates"
export type SortField = "awb" | "jaster" | "cis" | "unifikasi"
export type SortDirection = "asc" | "desc"

interface UseTableFiltersOptions {
  rows: ComparisonRow[]
  initialPageSize?: number
}

interface UseTableFiltersReturn {
  // State
  searchTerm: string
  filter: FilterType
  sortField: SortField
  sortDirection: SortDirection
  currentPage: number
  pageSize: number

  // Setters
  setSearchTerm: (term: string) => void
  setFilter: (filter: FilterType) => void
  setSortField: (field: SortField) => void
  setSortDirection: (direction: SortDirection) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void

  // Computed
  filteredAndSortedRows: ComparisonRow[]
  paginatedRows: ComparisonRow[]
  totalPages: number
  startIndex: number
  endIndex: number

  // Actions
  handleSort: (field: SortField) => void
  resetPage: () => void
}

/**
 * Custom hook to manage table filtering, sorting, and pagination
 */
export function useTableFilters({ rows, initialPageSize = 50 }: UseTableFiltersOptions): UseTableFiltersReturn {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortField, setSortField] = useState<SortField>("awb")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((row) => row.awb.toLowerCase().includes(term))
    }

    // Apply type filter
    switch (filter) {
      case "mismatches":
        filtered = filtered.filter((row) => !row.weightMatch && row.discrepancies.length > 0)
        break
      case "missing":
        filtered = filtered.filter(
          (row) => row.jasterWeight === null || row.cisWeight === null || row.unifikasiWeight === null,
        )
        break
      case "perfect":
        filtered = filtered.filter(
          (row) =>
            row.jasterWeight !== null && row.cisWeight !== null && row.unifikasiWeight !== null && row.weightMatch,
        )
        break
      case "duplicates":
        filtered = filtered.filter((row) => row.hasDuplicates)
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: string | number | null
      let bVal: string | number | null

      switch (sortField) {
        case "awb":
          aVal = a.awb
          bVal = b.awb
          break
        case "jaster":
          aVal = a.jasterWeight ?? -1
          bVal = b.jasterWeight ?? -1
          break
        case "cis":
          aVal = a.cisWeight ?? -1
          bVal = b.cisWeight ?? -1
          break
        case "unifikasi":
          aVal = a.unifikasiWeight ?? -1
          bVal = b.unifikasiWeight ?? -1
          break
      }

      if (aVal === null) return 1
      if (bVal === null) return -1

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return filtered
  }, [rows, searchTerm, filter, sortField, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredAndSortedRows.length)
  const paginatedRows = useMemo(
    () => filteredAndSortedRows.slice(startIndex, endIndex),
    [filteredAndSortedRows, startIndex, endIndex],
  )

  const handleSort = useCallback((field: SortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"))
        return prevField
      }
      setSortDirection("asc")
      return field
    })
  }, [])

  const resetPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  // Reset to page 1 when filters change
  useMemo(() => {
    resetPage()
  }, [searchTerm, filter, resetPage])

  return {
    searchTerm,
    filter,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    setSearchTerm,
    setFilter,
    setSortField,
    setSortDirection,
    setCurrentPage,
    setPageSize,
    filteredAndSortedRows,
    paginatedRows,
    totalPages,
    startIndex,
    endIndex,
    handleSort,
    resetPage,
  }
}

"use client"

import { memo, useCallback, useMemo } from "react"
import { Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ComparisonRow } from "@/lib/types"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { useTableFilters, type FilterType } from "@/lib/hooks/useTableFilters"
import { DEBOUNCE_DELAY, PAGE_SIZE_OPTIONS } from "@/lib/constants"

interface WeightComparisonTableProps {
  rows: ComparisonRow[]
}

export const WeightComparisonTable = memo(function WeightComparisonTable({ rows }: WeightComparisonTableProps) {
  const {
    searchTerm,
    filter,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    setSearchTerm,
    setFilter,
    setCurrentPage,
    setPageSize,
    filteredAndSortedRows,
    paginatedRows,
    totalPages,
    startIndex,
    endIndex,
    handleSort,
  } = useTableFilters({ rows })

  // Debounce search to avoid excessive re-renders
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY)

  const getWeightStatus = useCallback((row: ComparisonRow) => {
    const hasAll = row.jasterWeight !== null && row.cisWeight !== null && row.unifikasiWeight !== null

    if (hasAll && row.weightMatch) {
      return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Match</Badge>
    }
    if (hasAll && !row.weightMatch) {
      return <Badge variant="destructive">Mismatch</Badge>
    }
    return <Badge variant="secondary">Incomplete</Badge>
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by AWB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="perfect">Perfect Matches</SelectItem>
                <SelectItem value="mismatches">Weight Mismatches</SelectItem>
                <SelectItem value="missing">Missing Weights</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedRows.length)} of {filteredAndSortedRows.length}{" "}
          records
        </div>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("awb")} className="h-8 px-2">
                    AWB Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("jaster")} className="h-8 px-2">
                    JASTER (CHW)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("cis")} className="h-8 px-2">
                    CIS (Chw. Weight)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("unifikasi")} className="h-8 px-2">
                    UNIFIKASI (Kg)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Weight Status</TableHead>
                <TableHead>Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => {
                  const weights = [row.jasterWeight, row.cisWeight, row.unifikasiWeight].filter(
                    (w) => w !== null,
                  ) as number[]
                  const maxDiff = weights.length > 1 ? Math.max(...weights) - Math.min(...weights) : 0

                  return (
                    <TableRow key={row.awb}>
                      <TableCell className="font-mono font-medium">{row.awb}</TableCell>
                      <TableCell>
                        {row.jasterWeight !== null ? (
                          <span
                            className={
                              !row.weightMatch && row.jasterWeight !== null ? "text-amber-500 font-medium" : ""
                            }
                          >
                            {row.jasterWeight.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.cisWeight !== null ? (
                          <span
                            className={!row.weightMatch && row.cisWeight !== null ? "text-amber-500 font-medium" : ""}
                          >
                            {row.cisWeight.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.unifikasiWeight !== null ? (
                          <span
                            className={
                              !row.weightMatch && row.unifikasiWeight !== null ? "text-amber-500 font-medium" : ""
                            }
                          >
                            {row.unifikasiWeight.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{getWeightStatus(row)}</TableCell>
                      <TableCell>
                        {maxDiff > 0 ? (
                          <span className="text-amber-500 font-medium">±{maxDiff.toFixed(2)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
})

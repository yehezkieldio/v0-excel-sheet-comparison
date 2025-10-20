"use client"

import { useState, useMemo } from "react"
import { Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ComparisonRow } from "@/lib/types"

interface WeightComparisonTableProps {
  rows: ComparisonRow[]
}

type FilterType = "all" | "mismatches" | "missing" | "perfect"
type SortField = "awb" | "jaster" | "cis" | "unifikasi"
type SortDirection = "asc" | "desc"

export function WeightComparisonTable({ rows }: WeightComparisonTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortField, setSortField] = useState<SortField>("awb")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows

    if (searchTerm) {
      filtered = filtered.filter((row) => row.awb.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filter === "mismatches") {
      filtered = filtered.filter((row) => !row.weightMatch && row.discrepancies.length > 0)
    } else if (filter === "missing") {
      filtered = filtered.filter(
        (row) => row.jasterWeight === null || row.cisWeight === null || row.unifikasiWeight === null,
      )
    } else if (filter === "perfect") {
      filtered = filtered.filter(
        (row) => row.jasterWeight !== null && row.cisWeight !== null && row.unifikasiWeight !== null && row.weightMatch,
      )
    }

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
  const endIndex = startIndex + pageSize
  const paginatedRows = filteredAndSortedRows.slice(startIndex, endIndex)

  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, filter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getWeightStatus = (row: ComparisonRow) => {
    const hasAll = row.jasterWeight !== null && row.cisWeight !== null && row.unifikasiWeight !== null

    if (hasAll && row.weightMatch) {
      return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Match</Badge>
    }
    if (hasAll && !row.weightMatch) {
      return <Badge variant="destructive">Mismatch</Badge>
    }
    return <Badge variant="secondary">Incomplete</Badge>
  }

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
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
}

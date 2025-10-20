"use client"

import { useState, useMemo } from "react"
import { Search, ArrowUpDown, Filter, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ComparisonRow } from "@/lib/types"

interface AwbComparisonTableProps {
  rows: ComparisonRow[]
}

type FilterType = "all" | "all-sheets" | "jaster-only" | "cis-only" | "unifikasi-only" | "missing-any"
type SortDirection = "asc" | "desc"

export function AwbComparisonTable({ rows }: AwbComparisonTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows

    if (searchTerm) {
      filtered = filtered.filter((row) => row.awb.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    switch (filter) {
      case "all-sheets":
        filtered = filtered.filter((row) => row.status.inJaster && row.status.inCis && row.status.inUnifikasi)
        break
      case "jaster-only":
        filtered = filtered.filter((row) => row.status.inJaster && !row.status.inCis && !row.status.inUnifikasi)
        break
      case "cis-only":
        filtered = filtered.filter((row) => !row.status.inJaster && row.status.inCis && !row.status.inUnifikasi)
        break
      case "unifikasi-only":
        filtered = filtered.filter((row) => !row.status.inJaster && !row.status.inCis && row.status.inUnifikasi)
        break
      case "missing-any":
        filtered = filtered.filter((row) => !row.status.inJaster || !row.status.inCis || !row.status.inUnifikasi)
        break
    }

    filtered.sort((a, b) => {
      return sortDirection === "asc" ? a.awb.localeCompare(b.awb) : b.awb.localeCompare(a.awb)
    })

    return filtered
  }, [rows, searchTerm, filter, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedRows = filteredAndSortedRows.slice(startIndex, endIndex)

  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, filter, sortDirection])

  const getPresenceStatus = (row: ComparisonRow) => {
    const count = [row.status.inJaster, row.status.inCis, row.status.inUnifikasi].filter(Boolean).length

    if (count === 3) {
      return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">All Sheets</Badge>
    }
    if (count === 2) {
      return <Badge variant="secondary">2 Sheets</Badge>
    }
    if (count === 1) {
      return <Badge variant="destructive">1 Sheet Only</Badge>
    }
    return <Badge variant="outline">None</Badge>
  }

  const getMissingSheets = (row: ComparisonRow) => {
    const missing = []
    if (!row.status.inJaster) missing.push("JASTER")
    if (!row.status.inCis) missing.push("CIS")
    if (!row.status.inUnifikasi) missing.push("UNIFIKASI")
    return missing
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
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="all-sheets">In All Sheets</SelectItem>
                <SelectItem value="missing-any">Missing from Any</SelectItem>
                <SelectItem value="jaster-only">JASTER Only</SelectItem>
                <SelectItem value="cis-only">CIS Only</SelectItem>
                <SelectItem value="unifikasi-only">UNIFIKASI Only</SelectItem>
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
                  <Button
                    variant="ghost"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="h-8 px-2"
                  >
                    AWB Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">JASTER</TableHead>
                <TableHead className="text-center">CIS</TableHead>
                <TableHead className="text-center">UNIFIKASI</TableHead>
                <TableHead>Presence Status</TableHead>
                <TableHead>Missing From</TableHead>
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
                  const missing = getMissingSheets(row)

                  return (
                    <TableRow key={row.awb}>
                      <TableCell className="font-mono font-medium">{row.awb}</TableCell>
                      <TableCell className="text-center">
                        {row.status.inJaster ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 inline-block" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.status.inCis ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 inline-block" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.status.inUnifikasi ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 inline-block" />
                        )}
                      </TableCell>
                      <TableCell>{getPresenceStatus(row)}</TableCell>
                      <TableCell>
                        {missing.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {missing.map((sheet) => (
                              <Badge key={sheet} variant="outline" className="text-xs">
                                {sheet}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
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

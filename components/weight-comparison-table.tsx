"use client"

import { memo, useCallback, useMemo } from "react"
import { Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight, XCircle } from "lucide-react"
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
      return <Badge className="bg-success/10 text-success hover:bg-success/15 border-success/20 font-medium">✓ Cocok</Badge>
    }
    if (hasAll && !row.weightMatch) {
      return <Badge className="bg-warning/10 text-warning hover:bg-warning/15 border-warning/20 font-medium">⚠ Tidak Cocok</Badge>
    }
    return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 border-border/50 font-medium">— Tidak Lengkap</Badge>
  }, [])

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="border border-border/60 bg-white shadow-sm">
        <div className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nomor AWB..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-border/60 focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                  <SelectTrigger className="w-[200px] border-border/60">
                    <SelectValue placeholder="Filter berdasarkan status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Data</SelectItem>
                    <SelectItem value="perfect">✓ Kecocokan Sempurna</SelectItem>
                    <SelectItem value="mismatches">⚠ Ketidakcocokan Berat</SelectItem>
                    <SelectItem value="missing">✕ Berat Hilang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Per halaman:</span>
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="w-[80px] h-9 border-border/60">
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
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{startIndex + 1}-{Math.min(endIndex, filteredAndSortedRows.length)}</span> dari{" "}
          <span className="font-semibold text-foreground">{filteredAndSortedRows.length}</span> data
        </div>
        <div className="text-xs text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      {/* Data Table */}
      <Card className="border border-border/60 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-border/60 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("awb")}
                    className="h-8 px-2 hover:bg-slate-100"
                  >
                    Nomor AWB
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("jaster")}
                    className="h-8 px-2 hover:bg-slate-100"
                  >
                    JASTER (CHW)
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("cis")}
                    className="h-8 px-2 hover:bg-slate-100"
                  >
                    CIS (Chw. Weight)
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("unifikasi")}
                    className="h-8 px-2 hover:bg-slate-100"
                  >
                    UNIFIKASI (Kg)
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Selisih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    <div className="flex flex-col items-center gap-2">
                      <XCircle className="h-8 w-8 text-muted-foreground/40" />
                      <p className="font-medium">Tidak ada data ditemukan</p>
                      <p className="text-xs">Coba sesuaikan filter atau kata kunci pencarian Anda</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => {
                  const weights = [row.jasterWeight, row.cisWeight, row.unifikasiWeight].filter(
                    (w) => w !== null,
                  ) as number[]
                  const maxDiff = weights.length > 1 ? Math.max(...weights) - Math.min(...weights) : 0

                  return (
                    <TableRow key={row.awb} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-mono font-semibold text-sm">{row.awb}</TableCell>
                      <TableCell className="font-medium tabular-nums">
                        {row.jasterWeight !== null ? (
                          <span
                            className={
                              !row.weightMatch && row.jasterWeight !== null ? "text-warning font-semibold" : "text-foreground"
                            }
                          >
                            {row.jasterWeight.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">
                        {row.cisWeight !== null ? (
                          <span
                            className={!row.weightMatch && row.cisWeight !== null ? "text-warning font-semibold" : "text-foreground"}
                          >
                            {row.cisWeight.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">
                        {row.unifikasiWeight !== null ? (
                          <span
                            className={
                              !row.weightMatch && row.unifikasiWeight !== null ? "text-warning font-semibold" : "text-foreground"
                            }
                          >
                            {row.unifikasiWeight.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell>{getWeightStatus(row)}</TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        {maxDiff > 0 ? (
                          <span className="text-warning">±{maxDiff.toFixed(2)} kg</span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="border border-border/60 bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Halaman <span className="font-semibold text-foreground">{currentPage}</span> dari <span className="font-semibold text-foreground">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-border/60 hover:bg-primary/5 hover:border-primary/30 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-border/60 hover:bg-primary/5 hover:border-primary/30 disabled:opacity-40"
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
})

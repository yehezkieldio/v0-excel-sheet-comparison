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
      return <Badge className="bg-success/10 text-success hover:bg-success/15 border-success/20 font-medium">✓ Semua Sistem</Badge>
    }
    if (count === 2) {
      return <Badge className="bg-warning/10 text-warning hover:bg-warning/15 border-warning/20 font-medium">⚠ 2 Sistem</Badge>
    }
    if (count === 1) {
      return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/15 border-destructive/20 font-medium">✕ 1 Sistem</Badge>
    }
    return <Badge variant="outline">Tidak Ada</Badge>
  }

  const getMissingSheets = (row: ComparisonRow) => {
    const missing = []
    if (!row.status.inJaster) missing.push("JASTER")
    if (!row.status.inCis) missing.push("CIS")
    if (!row.status.inUnifikasi) missing.push("UNIFIKASI")
    return missing
  }

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
                  <SelectTrigger className="w-[220px] border-border/60">
                    <SelectValue placeholder="Filter berdasarkan sistem..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Data</SelectItem>
                    <SelectItem value="all-sheets">✓ Semua Sistem</SelectItem>
                    <SelectItem value="missing-any">⚠ Hilang dari Sistem Manapun</SelectItem>
                    <SelectItem value="jaster-only">Hanya JASTER</SelectItem>
                    <SelectItem value="cis-only">Hanya CIS</SelectItem>
                    <SelectItem value="unifikasi-only">Hanya UNIFIKASI</SelectItem>
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
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
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
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="h-8 px-2 hover:bg-slate-100"
                  >
                    Nomor AWB
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Keberadaan AWB</TableHead>
                <TableHead className="font-semibold text-foreground text-center">JASTER</TableHead>
                <TableHead className="font-semibold text-foreground text-center">CIS</TableHead>
                <TableHead className="font-semibold text-foreground text-center">UNIFIKASI</TableHead>
                <TableHead className="font-semibold text-foreground">Hilang Dari</TableHead>
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
                  const missing = getMissingSheets(row)

                  return (
                    <TableRow key={row.awb} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-mono font-semibold text-sm">{row.awb}</TableCell>
                      <TableCell>{getPresenceStatus(row)}</TableCell>
                      <TableCell className="text-center">
                        {row.status.inJaster ? (
                          <CheckCircle2 className="h-5 w-5 text-success inline-block" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive/60 inline-block" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.status.inCis ? (
                          <CheckCircle2 className="h-5 w-5 text-success inline-block" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive/60 inline-block" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.status.inUnifikasi ? (
                          <CheckCircle2 className="h-5 w-5 text-success inline-block" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive/60 inline-block" />
                        )}
                      </TableCell>
                      <TableCell>
                        {missing.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {missing.map((sheet) => (
                              <Badge key={sheet} variant="outline" className="text-xs font-mono">
                                {sheet}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50 text-sm">—</span>
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
}

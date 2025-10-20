"use client"

import { useState, useMemo } from "react"
import { Search, ArrowUpDown, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ComparisonRow } from "@/lib/types"

interface ComparisonTableProps {
  rows: ComparisonRow[]
}

type FilterType = "all" | "mismatches" | "missing" | "perfect"
type SortField = "awb" | "jaster" | "cis" | "unifikasi"
type SortDirection = "asc" | "desc"

export function ComparisonTable({ rows }: ComparisonTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortField, setSortField] = useState<SortField>("awb")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((row) => row.awb.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply type filter
    if (filter === "mismatches") {
      filtered = filtered.filter((row) => !row.weightMatch && row.discrepancies.length > 0)
    } else if (filter === "missing") {
      filtered = filtered.filter((row) => !row.status.inJaster || !row.status.inCis || !row.status.inUnifikasi)
    } else if (filter === "perfect") {
      filtered = filtered.filter(
        (row) => row.status.inJaster && row.status.inCis && row.status.inUnifikasi && row.weightMatch,
      )
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (row: ComparisonRow) => {
    if (row.status.inJaster && row.status.inCis && row.status.inUnifikasi && row.weightMatch) {
      return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Kecocokan Sempurna</Badge>
    }
    if (row.discrepancies.length > 0) {
      return <Badge variant="destructive">{row.discrepancies.length} Masalah</Badge>
    }
    return <Badge variant="secondary">Sebagian</Badge>
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan AWB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter berdasarkan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Data</SelectItem>
                <SelectItem value="perfect">Kecocokan Sempurna</SelectItem>
                <SelectItem value="mismatches">Ketidakcocokan Berat</SelectItem>
                <SelectItem value="missing">Data Hilang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredAndSortedRows.length} dari {rows.length} data
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("awb")} className="h-8 px-2">
                    Nomor AWB
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
                <TableHead>Status</TableHead>
                <TableHead>Masalah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedRows.map((row) => (
                  <TableRow key={row.awb}>
                    <TableCell className="font-mono font-medium">{row.awb}</TableCell>
                    <TableCell>
                      {row.jasterWeight !== null ? (
                        <span className={row.status.inJaster ? "text-foreground" : "text-muted-foreground"}>
                          {row.jasterWeight.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.cisWeight !== null ? (
                        <span className={row.status.inCis ? "text-foreground" : "text-muted-foreground"}>
                          {row.cisWeight.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.unifikasiWeight !== null ? (
                        <span className={row.status.inUnifikasi ? "text-foreground" : "text-muted-foreground"}>
                          {row.unifikasiWeight.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(row)}</TableCell>
                    <TableCell>
                      {row.discrepancies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.discrepancies.map((issue, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Tidak Ada</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

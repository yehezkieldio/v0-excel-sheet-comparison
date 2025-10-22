export interface SheetData {
  awb: string
  weight: number
}

export interface ParsedExcelData {
  jaster: SheetData[]
  cis: SheetData[]
  unifikasi: SheetData[]
}

export interface ComparisonRow {
  awb: string
  jasterWeight: number | null
  cisWeight: number | null
  unifikasiWeight: number | null
  status: {
    inJaster: boolean
    inCis: boolean
    inUnifikasi: boolean
  }
  weightMatch: boolean
  discrepancies: string[]
  hasDuplicates: boolean
  duplicateInfo?: {
    jasterDuplicate?: boolean
    cisDuplicate?: boolean
    unifikasiDuplicate?: boolean
  }
}

export interface ComparisonStats {
  totalUniqueAwbs: number
  inAllThree: number
  inJasterOnly: number
  inCisOnly: number
  inUnifikasiOnly: number
  inJasterAndCis: number
  inJasterAndUnifikasi: number
  inCisAndUnifikasi: number
  weightMismatches: number
  perfectMatches: number
}

export interface ComparisonResult {
  rows: ComparisonRow[]
  stats: ComparisonStats
  timestamp: Date
}

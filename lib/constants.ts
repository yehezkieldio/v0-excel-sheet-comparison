// Application Constants

// Pagination
export const DEFAULT_PAGE_SIZE = 50
export const PAGE_SIZE_OPTIONS = [25, 50, 100, 200] as const

// Comparison thresholds
export const WEIGHT_MATCH_THRESHOLD = 0.01

// Sheet names
export const SHEET_NAMES = {
  JASTER: "JASTER",
  CIS: "CIS",
  UNIFIKASI: "UNIFIKASI",
} as const

// Column name mappings for flexible Excel parsing
export const COLUMN_MAPPINGS = {
  JASTER: {
    AWB: ["AWB", "awb"],
    WEIGHT: ["CHW", "Chw", "chw", "CHW ", "Chw ", "chw "],
  },
  CIS: {
    AWB: ["No AWB", "No. AWB", "AWB", "no awb"],
    WEIGHT: ["Chw. Weight", "Chw Weight", "CHW Weight", "Weight", "chw. weight"],
  },
  UNIFIKASI: {
    AWB: ["SMU", "smu"],
    WEIGHT: ["Kg", "kg", "KG", "Weight", "weight"],
  },
} as const

// File upload
export const ACCEPTED_FILE_TYPES = [".xlsx", ".xls"] as const
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// Export
export const EXPORT_FILE_PREFIX = "excel-comparison-report"

// Performance
export const DEBOUNCE_DELAY = 300 // milliseconds
export const VIRTUAL_SCROLL_OVERSCAN = 5 // number of items to render outside viewport

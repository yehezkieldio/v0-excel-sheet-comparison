import * as XLSX from "xlsx"
import type { ParsedExcelData, SheetData } from "./types"
import { SHEET_NAMES, COLUMN_MAPPINGS } from "./constants"

/**
 * Finds a column in a row by trying multiple possible names
 * Uses case-insensitive matching with whitespace trimming
 */
function findColumn(row: Record<string, unknown>, possibleNames: readonly string[]): string | null {
  const rowKeys = Object.keys(row)

  for (const name of possibleNames) {
    // Try exact match first
    if (row[name] !== undefined) {
      return name
    }

    // Try case-insensitive match with trimming
    const found = rowKeys.find((key) => key.toLowerCase().trim() === name.toLowerCase().trim())
    if (found) {
      return found
    }
  }

  return null
}

/**
 * Safely parses a value to a number, returning 0 if invalid
 */
function parseWeight(value: unknown): number {
  if (value === null || value === undefined || value === "") {
    return 0
  }
  const parsed = Number.parseFloat(String(value))
  return Number.isNaN(parsed) ? 0 : parsed
}

/**
 * Parses a sheet into SheetData array
 */
function parseSheet(
  data: Array<Record<string, unknown>>,
  awbColumns: readonly string[],
  weightColumns: readonly string[],
  sheetName: string
): SheetData[] {
  return data
    .filter((row) => {
      const awbCol = findColumn(row, awbColumns)
      return awbCol && row[awbCol]
    })
    .map((row) => {
      const awbCol = findColumn(row, awbColumns)
      const weightCol = findColumn(row, weightColumns)

      if (!awbCol) {
        throw new Error(`AWB column not found in ${sheetName}`)
      }

      return {
        awb: String(row[awbCol]).trim(),
        weight: weightCol ? parseWeight(row[weightCol]) : 0,
      }
    })
}

/**
 * Parses an Excel file containing JASTER, CIS, and UNIFIKASI sheets
 * @param file - The Excel file to parse
 * @returns Promise with parsed data from all three sheets
 * @throws Error if required sheets are missing or file cannot be read
 */
export async function parseExcelFile(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          throw new Error("No data received from file")
        }

        const workbook = XLSX.read(data, { type: "binary" })

        // Validate required sheets exist
        const requiredSheets = [SHEET_NAMES.JASTER, SHEET_NAMES.CIS, SHEET_NAMES.UNIFIKASI]
        const missingSheets = requiredSheets.filter((sheet) => !workbook.SheetNames.includes(sheet))

        if (missingSheets.length > 0) {
          throw new Error(`Missing required sheets: ${missingSheets.join(", ")}`)
        }

        // Parse JASTER sheet
        const jasterSheet = workbook.Sheets[SHEET_NAMES.JASTER]
        const jasterData = XLSX.utils.sheet_to_json<Record<string, unknown>>(jasterSheet)
        const jaster = parseSheet(
          jasterData,
          COLUMN_MAPPINGS.JASTER.AWB,
          COLUMN_MAPPINGS.JASTER.WEIGHT,
          SHEET_NAMES.JASTER
        )

        // Parse CIS sheet
        const cisSheet = workbook.Sheets[SHEET_NAMES.CIS]
        const cisData = XLSX.utils.sheet_to_json<Record<string, unknown>>(cisSheet)
        const cis = parseSheet(cisData, COLUMN_MAPPINGS.CIS.AWB, COLUMN_MAPPINGS.CIS.WEIGHT, SHEET_NAMES.CIS)

        // Parse UNIFIKASI sheet
        const unifikasiSheet = workbook.Sheets[SHEET_NAMES.UNIFIKASI]
        const unifikasiData = XLSX.utils.sheet_to_json<Record<string, unknown>>(unifikasiSheet)
        const unifikasi = parseSheet(
          unifikasiData,
          COLUMN_MAPPINGS.UNIFIKASI.AWB,
          COLUMN_MAPPINGS.UNIFIKASI.WEIGHT,
          SHEET_NAMES.UNIFIKASI
        )

        // Validate we got some data
        if (jaster.length === 0 && cis.length === 0 && unifikasi.length === 0) {
          throw new Error("No valid data found in any sheet")
        }

        resolve({ jaster, cis, unifikasi })
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to parse Excel file"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsBinaryString(file)
  })
}

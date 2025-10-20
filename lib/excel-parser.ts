import * as XLSX from "xlsx"
import type { ParsedExcelData, SheetData } from "./types"

function findColumn(row: any, possibleNames: string[]): string | null {
  const rowKeys = Object.keys(row)

  for (const name of possibleNames) {
    // Try exact match first
    if (row[name] !== undefined) {
      return name
    }

    // Try case-insensitive match
    const found = rowKeys.find((key) => key.toLowerCase().trim() === name.toLowerCase().trim())
    if (found) {
      return found
    }
  }

  return null
}

export async function parseExcelFile(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })

        // Check if required sheets exist
        const requiredSheets = ["JASTER", "CIS", "UNIFIKASI"]
        const missingSheets = requiredSheets.filter((sheet) => !workbook.SheetNames.includes(sheet))

        if (missingSheets.length > 0) {
          throw new Error(`Missing required sheets: ${missingSheets.join(", ")}`)
        }

        // Parse JASTER sheet (AWB, CHW)
        const jasterSheet = workbook.Sheets["JASTER"]
        const jasterData = XLSX.utils.sheet_to_json<any>(jasterSheet)

        if (jasterData.length > 0) {
          console.log("[v0] JASTER columns found:", Object.keys(jasterData[0]))
        }

        const jaster: SheetData[] = jasterData
          .filter((row) => {
            const awbCol = findColumn(row, ["AWB", "awb"])
            return awbCol && row[awbCol]
          })
          .map((row) => {
            const awbCol = findColumn(row, ["AWB", "awb"])
            const weightCol = findColumn(row, ["CHW", "Chw", "chw", "CHW ", "Chw ", "chw "])

            const weightValue = weightCol ? row[weightCol] : null
            console.log(
              "[v0] JASTER row - AWB:",
              row[awbCol!],
              "Weight column:",
              weightCol,
              "Weight value:",
              weightValue,
            )

            return {
              awb: String(row[awbCol!]).trim(),
              weight: weightCol ? Number.parseFloat(weightValue) || 0 : 0,
            }
          })

        // Parse CIS sheet (No AWB, Chw. Weight)
        const cisSheet = workbook.Sheets["CIS"]
        const cisData = XLSX.utils.sheet_to_json<any>(cisSheet)

        if (cisData.length > 0) {
          console.log("[v0] CIS columns found:", Object.keys(cisData[0]))
        }

        const cis: SheetData[] = cisData
          .filter((row) => {
            const awbCol = findColumn(row, ["No AWB", "No. AWB", "AWB", "no awb"])
            return awbCol && row[awbCol]
          })
          .map((row) => {
            const awbCol = findColumn(row, ["No AWB", "No. AWB", "AWB", "no awb"])
            const weightCol = findColumn(row, ["Chw. Weight", "Chw Weight", "CHW Weight", "Weight", "chw. weight"])

            return {
              awb: String(row[awbCol!]).trim(),
              weight: weightCol ? Number.parseFloat(row[weightCol]) || 0 : 0,
            }
          })

        // Parse UNIFIKASI sheet (SMU, Kg)
        const unifikasiSheet = workbook.Sheets["UNIFIKASI"]
        const unifikasiData = XLSX.utils.sheet_to_json<any>(unifikasiSheet)

        if (unifikasiData.length > 0) {
          console.log("[v0] UNIFIKASI columns found:", Object.keys(unifikasiData[0]))
        }

        const unifikasi: SheetData[] = unifikasiData
          .filter((row) => {
            const awbCol = findColumn(row, ["SMU", "smu"])
            return awbCol && row[awbCol]
          })
          .map((row) => {
            const awbCol = findColumn(row, ["SMU", "smu"])
            const weightCol = findColumn(row, ["Kg", "kg", "KG", "Weight", "weight"])

            return {
              awb: String(row[awbCol!]).trim(),
              weight: weightCol ? Number.parseFloat(row[weightCol]) || 0 : 0,
            }
          })

        console.log("[v0] Parsed data summary:", {
          jaster: jaster.length,
          cis: cis.length,
          unifikasi: unifikasi.length,
        })

        resolve({ jaster, cis, unifikasi })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsBinaryString(file)
  })
}

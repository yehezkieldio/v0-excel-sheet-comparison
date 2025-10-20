import * as XLSX from "xlsx"
import type { ComparisonResult } from "./types"
import { EXPORT_FILE_PREFIX } from "./constants"

/**
 * Exports comparison results to an Excel file with multiple sheets
 * @param result - The comparison result to export
 * @throws Error if export fails
 */
export function exportToExcel(result: ComparisonResult): void {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Prepare summary data
    const summaryData = [
      ["Excel Comparison Report"],
      ["Generated:", result.timestamp.toLocaleString()],
      [""],
      ["Summary Statistics"],
      ["Total Unique AWBs", result.stats.totalUniqueAwbs],
      ["Perfect Matches", result.stats.perfectMatches],
      ["Weight Mismatches", result.stats.weightMismatches],
      ["In All Three Sheets", result.stats.inAllThree],
      [""],
      ["Distribution"],
      ["JASTER Only", result.stats.inJasterOnly],
      ["CIS Only", result.stats.inCisOnly],
      ["UNIFIKASI Only", result.stats.inUnifikasiOnly],
      ["JASTER & CIS", result.stats.inJasterAndCis],
      ["JASTER & UNIFIKASI", result.stats.inJasterAndUnifikasi],
      ["CIS & UNIFIKASI", result.stats.inCisAndUnifikasi],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")

    // Prepare detailed comparison data
    const detailedData = result.rows.map((row) => ({
      "AWB Number": row.awb,
      "JASTER Weight": row.jasterWeight ?? "—",
      "CIS Weight": row.cisWeight ?? "—",
      "UNIFIKASI Weight": row.unifikasiWeight ?? "—",
      "In JASTER": row.status.inJaster ? "Yes" : "No",
      "In CIS": row.status.inCis ? "Yes" : "No",
      "In UNIFIKASI": row.status.inUnifikasi ? "Yes" : "No",
      "Weight Match": row.weightMatch ? "Yes" : "No",
      Issues: row.discrepancies.join(", ") || "None",
    }))

    const detailedSheet = XLSX.utils.json_to_sheet(detailedData)
    XLSX.utils.book_append_sheet(workbook, detailedSheet, "Detailed Comparison")

    // Prepare mismatches only
    const mismatchData = result.rows
      .filter((row) => row.discrepancies.length > 0)
      .map((row) => ({
        "AWB Number": row.awb,
        "JASTER Weight": row.jasterWeight ?? "—",
        "CIS Weight": row.cisWeight ?? "—",
        "UNIFIKASI Weight": row.unifikasiWeight ?? "—",
        Issues: row.discrepancies.join(", "),
      }))

    const mismatchSheet = XLSX.utils.json_to_sheet(mismatchData)
    XLSX.utils.book_append_sheet(workbook, mismatchSheet, "Issues Only")

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
    const filename = `${EXPORT_FILE_PREFIX}-${timestamp}.xlsx`

    // Write the workbook to array buffer
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

    // Create a Blob from the binary data
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"

    document.body.appendChild(link)
    link.click()

    // Clean up after download starts
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Export error:", error)
    }
    throw new Error("Failed to export comparison report")
  }
}

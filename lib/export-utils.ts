import * as XLSX from "xlsx"
import type { ComparisonResult } from "./types"

export function exportToExcel(result: ComparisonResult) {
  console.log("[v0] Export started")

  // Create a new workbook
  const workbook = XLSX.utils.book_new()
  console.log("[v0] Workbook created")

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
  console.log("[v0] Summary sheet added")

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
  console.log("[v0] Detailed sheet added")

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
  console.log("[v0] Issues sheet added")

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
  const filename = `excel-comparison-report-${timestamp}.xlsx`
  console.log("[v0] Filename:", filename)

  try {
    // Write the workbook to a binary string
    console.log("[v0] Writing workbook to array...")
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    console.log("[v0] Workbook written, size:", wbout.byteLength, "bytes")

    // Create a Blob from the binary data
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    console.log("[v0] Blob created, size:", blob.size, "bytes")

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob)
    console.log("[v0] Object URL created:", url)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"

    console.log("[v0] Appending link to body...")
    document.body.appendChild(link)

    console.log("[v0] Clicking link...")
    link.click()

    console.log("[v0] Download triggered successfully")

    // Clean up after a short delay to ensure download starts
    setTimeout(() => {
      console.log("[v0] Cleaning up...")
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      console.log("[v0] Cleanup complete")
    }, 100)
  } catch (error) {
    console.error("[v0] Export error:", error)
    throw error
  }
}

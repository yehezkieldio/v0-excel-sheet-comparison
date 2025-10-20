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
      ["Laporan Perbandingan Excel"],
      ["Dibuat:", result.timestamp.toLocaleString()],
      [""],
      ["Statistik Ringkasan"],
      ["Total AWB Unik", result.stats.totalUniqueAwbs],
      ["Kecocokan Sempurna", result.stats.perfectMatches],
      ["Ketidakcocokan Berat", result.stats.weightMismatches],
      ["Di Semua Tiga Sheet", result.stats.inAllThree],
      [""],
      ["Distribusi"],
      ["Hanya JASTER", result.stats.inJasterOnly],
      ["Hanya CIS", result.stats.inCisOnly],
      ["Hanya UNIFIKASI", result.stats.inUnifikasiOnly],
      ["JASTER & CIS", result.stats.inJasterAndCis],
      ["JASTER & UNIFIKASI", result.stats.inJasterAndUnifikasi],
      ["CIS & UNIFIKASI", result.stats.inCisAndUnifikasi],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan")

    // Prepare detailed comparison data
    const detailedData = result.rows.map((row) => ({
      "Nomor AWB": row.awb,
      "Berat JASTER": row.jasterWeight ?? "—",
      "Berat CIS": row.cisWeight ?? "—",
      "Berat UNIFIKASI": row.unifikasiWeight ?? "—",
      "Di JASTER": row.status.inJaster ? "Ya" : "Tidak",
      "Di CIS": row.status.inCis ? "Ya" : "Tidak",
      "Di UNIFIKASI": row.status.inUnifikasi ? "Ya" : "Tidak",
      "Berat Cocok": row.weightMatch ? "Ya" : "Tidak",
      Masalah: row.discrepancies.join(", ") || "Tidak Ada",
    }))

    const detailedSheet = XLSX.utils.json_to_sheet(detailedData)
    XLSX.utils.book_append_sheet(workbook, detailedSheet, "Perbandingan Detail")

    // Prepare mismatches only
    const mismatchData = result.rows
      .filter((row) => row.discrepancies.length > 0)
      .map((row) => ({
        "Nomor AWB": row.awb,
        "Berat JASTER": row.jasterWeight ?? "—",
        "Berat CIS": row.cisWeight ?? "—",
        "Berat UNIFIKASI": row.unifikasiWeight ?? "—",
        Masalah: row.discrepancies.join(", "),
      }))

    const mismatchSheet = XLSX.utils.json_to_sheet(mismatchData)
    XLSX.utils.book_append_sheet(workbook, mismatchSheet, "Hanya Masalah")

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
    throw new Error("Gagal mengekspor laporan perbandingan")
  }
}

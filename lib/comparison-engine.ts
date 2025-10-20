import type { ParsedExcelData, ComparisonResult, ComparisonRow, ComparisonStats } from "./types"

export function compareSheets(data: ParsedExcelData): ComparisonResult {
  const { jaster, cis, unifikasi } = data

  // Create maps for quick lookup
  const jasterMap = new Map(jaster.map((item) => [item.awb, item.weight]))
  const cisMap = new Map(cis.map((item) => [item.awb, item.weight]))
  const unifikasiMap = new Map(unifikasi.map((item) => [item.awb, item.weight]))

  // Get all unique AWBs
  const allAwbs = new Set([...jasterMap.keys(), ...cisMap.keys(), ...unifikasiMap.keys()])

  // Build comparison rows
  const rows: ComparisonRow[] = []

  for (const awb of allAwbs) {
    const jasterWeight = jasterMap.get(awb) ?? null
    const cisWeight = cisMap.get(awb) ?? null
    const unifikasiWeight = unifikasiMap.get(awb) ?? null

    const status = {
      inJaster: jasterWeight !== null,
      inCis: cisWeight !== null,
      inUnifikasi: unifikasiWeight !== null,
    }

    // Check if weights match (allowing for small floating point differences)
    const weights = [jasterWeight, cisWeight, unifikasiWeight].filter((w) => w !== null) as number[]
    const weightMatch = weights.length > 1 ? weights.every((w) => Math.abs(w - weights[0]) < 0.01) : true

    // Build discrepancy list
    const discrepancies: string[] = []

    if (!status.inJaster) discrepancies.push("Missing in JASTER")
    if (!status.inCis) discrepancies.push("Missing in CIS")
    if (!status.inUnifikasi) discrepancies.push("Missing in UNIFIKASI")
    if (!weightMatch && weights.length > 1) discrepancies.push("Weight mismatch")

    rows.push({
      awb,
      jasterWeight,
      cisWeight,
      unifikasiWeight,
      status,
      weightMatch,
      discrepancies,
    })
  }

  // Calculate statistics
  const stats: ComparisonStats = {
    totalUniqueAwbs: allAwbs.size,
    inAllThree: 0,
    inJasterOnly: 0,
    inCisOnly: 0,
    inUnifikasiOnly: 0,
    inJasterAndCis: 0,
    inJasterAndUnifikasi: 0,
    inCisAndUnifikasi: 0,
    weightMismatches: 0,
    perfectMatches: 0,
  }

  for (const row of rows) {
    const { status, weightMatch } = row
    const count = [status.inJaster, status.inCis, status.inUnifikasi].filter(Boolean).length

    if (count === 3) {
      stats.inAllThree++
      if (weightMatch) {
        stats.perfectMatches++
      } else {
        stats.weightMismatches++
      }
    } else if (count === 2) {
      if (status.inJaster && status.inCis) stats.inJasterAndCis++
      if (status.inJaster && status.inUnifikasi) stats.inJasterAndUnifikasi++
      if (status.inCis && status.inUnifikasi) stats.inCisAndUnifikasi++
      if (!weightMatch) stats.weightMismatches++
    } else if (count === 1) {
      if (status.inJaster) stats.inJasterOnly++
      if (status.inCis) stats.inCisOnly++
      if (status.inUnifikasi) stats.inUnifikasiOnly++
    }
  }

  return {
    rows,
    stats,
    timestamp: new Date(),
  }
}

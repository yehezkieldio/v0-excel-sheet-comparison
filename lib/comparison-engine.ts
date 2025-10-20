import type { ParsedExcelData, ComparisonResult, ComparisonRow, ComparisonStats } from "./types"
import { WEIGHT_MATCH_THRESHOLD } from "./constants"

/**
 * Checks if weights match within a threshold
 */
function weightsMatch(weights: number[]): boolean {
  if (weights.length <= 1) return true
  const first = weights[0]
  return weights.every((w) => Math.abs(w - first) < WEIGHT_MATCH_THRESHOLD)
}

/**
 * Builds discrepancy list for a comparison row
 */
function buildDiscrepancies(
  status: { inJaster: boolean; inCis: boolean; inUnifikasi: boolean },
  weightMatch: boolean,
  hasMultipleWeights: boolean
): string[] {
  const discrepancies: string[] = []

  if (!status.inJaster) discrepancies.push("Hilang di JASTER")
  if (!status.inCis) discrepancies.push("Hilang di CIS")
  if (!status.inUnifikasi) discrepancies.push("Hilang di UNIFIKASI")
  if (!weightMatch && hasMultipleWeights) discrepancies.push("Berat tidak cocok")

  return discrepancies
}

/**
 * Compares three Excel sheets and generates a detailed comparison report
 * @param data - Parsed data from all three sheets
 * @returns Complete comparison result with statistics
 */
export function compareSheets(data: ParsedExcelData): ComparisonResult {
  const { jaster, cis, unifikasi } = data

  // Create maps for O(1) lookup performance
  const jasterMap = new Map(jaster.map((item) => [item.awb, item.weight]))
  const cisMap = new Map(cis.map((item) => [item.awb, item.weight]))
  const unifikasiMap = new Map(unifikasi.map((item) => [item.awb, item.weight]))

  // Get all unique AWBs using Set for deduplication
  const allAwbs = new Set([...jasterMap.keys(), ...cisMap.keys(), ...unifikasiMap.keys()])

  // Build comparison rows with optimized logic
  const rows: ComparisonRow[] = Array.from(allAwbs).map((awb) => {
    const jasterWeight = jasterMap.get(awb) ?? null
    const cisWeight = cisMap.get(awb) ?? null
    const unifikasiWeight = unifikasiMap.get(awb) ?? null

    const status = {
      inJaster: jasterWeight !== null,
      inCis: cisWeight !== null,
      inUnifikasi: unifikasiWeight !== null,
    }

    // Check if weights match (with threshold for floating point precision)
    const weights = [jasterWeight, cisWeight, unifikasiWeight].filter((w): w is number => w !== null)
    const weightMatch = weightsMatch(weights)

    // Build discrepancy list
    const discrepancies = buildDiscrepancies(status, weightMatch, weights.length > 1)

    return {
      awb,
      jasterWeight,
      cisWeight,
      unifikasiWeight,
      status,
      weightMatch,
      discrepancies,
    }
  })

  // Calculate statistics efficiently in a single pass
  const stats: ComparisonStats = rows.reduce<ComparisonStats>(
    (acc, row) => {
      const { status, weightMatch } = row
      const presenceCount = [status.inJaster, status.inCis, status.inUnifikasi].filter(Boolean).length

      if (presenceCount === 3) {
        acc.inAllThree++
        if (weightMatch) {
          acc.perfectMatches++
        } else {
          acc.weightMismatches++
        }
      } else if (presenceCount === 2) {
        if (status.inJaster && status.inCis) acc.inJasterAndCis++
        if (status.inJaster && status.inUnifikasi) acc.inJasterAndUnifikasi++
        if (status.inCis && status.inUnifikasi) acc.inCisAndUnifikasi++
        if (!weightMatch) acc.weightMismatches++
      } else if (presenceCount === 1) {
        if (status.inJaster) acc.inJasterOnly++
        if (status.inCis) acc.inCisOnly++
        if (status.inUnifikasi) acc.inUnifikasiOnly++
      }

      return acc
    },
    {
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
  )

  return {
    rows,
    stats,
    timestamp: new Date(),
  }
}

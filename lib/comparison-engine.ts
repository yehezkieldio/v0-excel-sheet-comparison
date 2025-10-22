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
 * Checks if an AWB has duplicate entries with different weights in a sheet
 */
function checkDuplicatesInSheet(data: Array<{ awb: string; weight: number }>, awb: string): boolean {
  const entries = data.filter((item) => item.awb === awb)
  if (entries.length <= 1) return false

  // Check if all weights are the same
  const weights = entries.map((e) => e.weight)
  const uniqueWeights = new Set(weights)

  return uniqueWeights.size > 1
}

/**
 * Gets all weight values for an AWB in a sheet (for duplicate handling)
 */
function getWeightsForAwb(data: Array<{ awb: string; weight: number }>, awb: string): number[] {
  return data.filter((item) => item.awb === awb).map((e) => e.weight)
}

/**
 * Builds discrepancy list for a comparison row
 */
function buildDiscrepancies(
  status: { inJaster: boolean; inCis: boolean; inUnifikasi: boolean },
  weightMatch: boolean,
  hasMultipleWeights: boolean,
  hasDuplicates: boolean,
  duplicateInfo?: { jasterDuplicate?: boolean; cisDuplicate?: boolean; unifikasiDuplicate?: boolean },
): string[] {
  const discrepancies: string[] = []

  if (!status.inJaster) discrepancies.push("Hilang di JASTER")
  if (!status.inCis) discrepancies.push("Hilang di CIS")
  if (!status.inUnifikasi) discrepancies.push("Hilang di UNIFIKASI")
  if (!weightMatch && hasMultipleWeights) discrepancies.push("Berat tidak cocok")

  if (hasDuplicates) {
    if (duplicateInfo?.jasterDuplicate) discrepancies.push("Duplikat di JASTER (berat berbeda)")
    if (duplicateInfo?.cisDuplicate) discrepancies.push("Duplikat di CIS (berat berbeda)")
    if (duplicateInfo?.unifikasiDuplicate) discrepancies.push("Duplikat di UNIFIKASI (berat berbeda)")
  }

  return discrepancies
}

/**
 * Compares three Excel sheets and generates a detailed comparison report
 * @param data - Parsed data from all three sheets
 * @returns Complete comparison result with statistics
 */
export function compareSheets(data: ParsedExcelData): ComparisonResult {
  const { jaster, cis, unifikasi } = data

  console.log("[v0] Starting comparison...")
  console.log(`[v0] JASTER entries: ${jaster.length}`)
  console.log(`[v0] CIS entries: ${cis.length}`)
  console.log(`[v0] UNIFIKASI entries: ${unifikasi.length}`)

  const jasterMap = new Map<string, number>()
  jaster.forEach((item) => {
    if (!jasterMap.has(item.awb)) {
      jasterMap.set(item.awb, item.weight)
    }
  })

  const cisMap = new Map<string, number>()
  cis.forEach((item) => {
    if (!cisMap.has(item.awb)) {
      cisMap.set(item.awb, item.weight)
    }
  })

  const unifikasiMap = new Map<string, number>()
  unifikasi.forEach((item) => {
    if (!unifikasiMap.has(item.awb)) {
      unifikasiMap.set(item.awb, item.weight)
    }
  })

  // Get all unique AWBs using Set for deduplication
  const allAwbs = new Set([...jasterMap.keys(), ...cisMap.keys(), ...unifikasiMap.keys()])

  console.log(`[v0] Total unique AWBs: ${allAwbs.size}`)

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

    const jasterDuplicate = checkDuplicatesInSheet(jaster, awb)
    const cisDuplicate = checkDuplicatesInSheet(cis, awb)
    const unifikasiDuplicate = checkDuplicatesInSheet(unifikasi, awb)
    const hasDuplicates = jasterDuplicate || cisDuplicate || unifikasiDuplicate

    const duplicateInfo = hasDuplicates
      ? {
          jasterDuplicate,
          cisDuplicate,
          unifikasiDuplicate,
        }
      : undefined

    // Check if weights match (with threshold for floating point precision)
    const weights = [jasterWeight, cisWeight, unifikasiWeight].filter((w): w is number => w !== null)
    const weightMatch = weightsMatch(weights)

    // Build discrepancy list
    const discrepancies = buildDiscrepancies(status, weightMatch, weights.length > 1, hasDuplicates, duplicateInfo)

    return {
      awb,
      jasterWeight,
      cisWeight,
      unifikasiWeight,
      status,
      weightMatch,
      discrepancies,
      hasDuplicates,
      duplicateInfo,
    }
  })

  const duplicateCount = rows.filter((r) => r.hasDuplicates).length
  console.log(`[v0] AWBs with duplicates (different weights): ${duplicateCount}`)

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
    },
  )

  console.log("[v0] Comparison complete")

  return {
    rows,
    stats,
    timestamp: new Date(),
  }
}

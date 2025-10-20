"use client"

import { useState, useCallback, lazy, Suspense } from "react"
import { FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExcelUploader } from "@/components/excel-uploader"
import { ErrorBoundary } from "@/components/error-boundary"
import type { ComparisonResult } from "@/lib/types"

// Lazy load the dashboard for better initial load performance
const ComparisonDashboard = lazy(() =>
  import("@/components/comparison-dashboard").then((mod) => ({ default: mod.ComparisonDashboard }))
)

// Loading fallback component
function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading comparison results...</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleComparisonComplete = useCallback((result: ComparisonResult) => {
    setComparisonResult(result)
    setError(null)
  }, [])

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    setComparisonResult(null)
  }, [])

  const handleReset = useCallback(() => {
    setComparisonResult(null)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Enterprise Header */}
      <header className="border-b border-border/60 bg-white shadow-sm">
        <div className="container mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">AWB Data Reconciliation</h1>
                <p className="text-sm font-medium text-muted-foreground">System Comparison & Validation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent px-4 py-2 border border-primary/20">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                <p className="text-sm font-semibold text-primary">Operational</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-8 border-l-4 border-destructive shadow-sm">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {!comparisonResult ? (
          <ExcelUploader onComparisonComplete={handleComparisonComplete} onError={handleError} />
        ) : (
          <ErrorBoundary>
            <Suspense fallback={<DashboardLoading />}>
              <ComparisonDashboard result={comparisonResult} onReset={handleReset} />
            </Suspense>
          </ErrorBoundary>
        )}
      </main>
    </div>
  )
}

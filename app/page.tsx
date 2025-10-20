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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileSpreadsheet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Excel Comparison Tool</h1>
              <p className="text-sm text-muted-foreground">Compare JASTER, CIS, and UNIFIKASI sheets</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
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

"use client"

import { useState } from "react"
import { FileSpreadsheet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExcelUploader } from "@/components/excel-uploader"
import { ComparisonDashboard } from "@/components/comparison-dashboard"
import type { ComparisonResult } from "@/lib/types"

export default function Home() {
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleComparisonComplete = (result: ComparisonResult) => {
    setComparisonResult(result)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setComparisonResult(null)
  }

  const handleReset = () => {
    setComparisonResult(null)
    setError(null)
  }

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
          <ComparisonDashboard result={comparisonResult} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}

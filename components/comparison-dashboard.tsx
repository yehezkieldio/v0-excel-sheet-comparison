"use client"

import { useState, useCallback, memo } from "react"
import { RotateCcw, Download, BarChart3, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatisticsView } from "@/components/statistics-view"
import { WeightComparisonTable } from "@/components/weight-comparison-table"
import { AwbComparisonTable } from "@/components/awb-comparison-table"
import type { ComparisonResult } from "@/lib/types"
import { exportToExcel } from "@/lib/export-utils"

interface ComparisonDashboardProps {
  result: ComparisonResult
  onReset: () => void
}

export const ComparisonDashboard = memo(function ComparisonDashboard({
  result,
  onReset,
}: ComparisonDashboardProps) {
  const [activeTab, setActiveTab] = useState("statistics")
  const [detailedTab, setDetailedTab] = useState("weights")

  const handleExport = useCallback(() => {
    try {
      exportToExcel(result)
    } catch (error) {
      alert("Failed to export report. Please try again.")
      if (process.env.NODE_ENV === "development") {
        console.error("Export failed:", error)
      }
    }
  }, [result])

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Comparison Results</h2>
          <p className="text-sm text-muted-foreground mt-1">Analyzed on {result.timestamp.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table2 className="h-4 w-4" />
            Detailed View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="mt-6">
          <StatisticsView stats={result.stats} />
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <Tabs value={detailedTab} onValueChange={setDetailedTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="weights">Weight Comparison</TabsTrigger>
              <TabsTrigger value="awb">AWB Presence</TabsTrigger>
            </TabsList>

            <TabsContent value="weights" className="mt-6">
              <WeightComparisonTable rows={result.rows} />
            </TabsContent>

            <TabsContent value="awb" className="mt-6">
              <AwbComparisonTable rows={result.rows} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
})

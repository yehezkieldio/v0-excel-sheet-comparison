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
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="bg-white border border-border/60 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success/10 to-success/5 flex items-center justify-center border border-success/20">
              <BarChart3 className="h-6 w-6 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Analysis Complete</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Report generated on {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-border/60 hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button
              variant="default"
              onClick={onReset}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              New Comparison
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-slate-100 p-1 rounded-lg border border-border/60">
          <TabsTrigger
            value="statistics"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <Table2 className="h-4 w-4" />
            <span className="font-medium">Details</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="mt-8">
          <StatisticsView stats={result.stats} />
        </TabsContent>

        <TabsContent value="table" className="mt-8">
          <Tabs value={detailedTab} onValueChange={setDetailedTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-11 bg-slate-100 p-1 rounded-lg border border-border/60">
              <TabsTrigger
                value="weights"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium"
              >
                Weight Analysis
              </TabsTrigger>
              <TabsTrigger
                value="awb"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium"
              >
                System Presence
              </TabsTrigger>
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

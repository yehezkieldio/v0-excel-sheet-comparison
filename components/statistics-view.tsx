"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, XCircle, Users } from "lucide-react"
import type { ComparisonStats } from "@/lib/types"

interface StatisticsViewProps {
  stats: ComparisonStats
}

export function StatisticsView({ stats }: StatisticsViewProps) {
  const statCards = [
    {
      label: "Total Unique AWBs",
      value: stats.totalUniqueAwbs,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Perfect Matches",
      value: stats.perfectMatches,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "In all 3 sheets with matching weights",
    },
    {
      label: "Weight Mismatches",
      value: stats.weightMismatches,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Present but weights don't match",
    },
    {
      label: "In All Three Sheets",
      value: stats.inAllThree,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ]

  const distributionCards = [
    {
      label: "JASTER Only",
      value: stats.inJasterOnly,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "CIS Only",
      value: stats.inCisOnly,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "UNIFIKASI Only",
      value: stats.inUnifikasiOnly,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "JASTER & CIS",
      value: stats.inJasterAndCis,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "JASTER & UNIFIKASI",
      value: stats.inJasterAndUnifikasi,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "CIS & UNIFIKASI",
      value: stats.inCisAndUnifikasi,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  {stat.description && <p className="text-xs text-muted-foreground">{stat.description}</p>}
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Distribution Analysis</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {distributionCards.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <XCircle className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">
              {((stats.perfectMatches / stats.totalUniqueAwbs) * 100).toFixed(1)}%
            </span>{" "}
            of AWBs are perfect matches across all three sheets.
          </p>
          <p>
            <span className="font-medium text-foreground">
              {((stats.weightMismatches / stats.totalUniqueAwbs) * 100).toFixed(1)}%
            </span>{" "}
            have weight discrepancies that need attention.
          </p>
          <p>
            <span className="font-medium text-foreground">
              {(((stats.inJasterOnly + stats.inCisOnly + stats.inUnifikasiOnly) / stats.totalUniqueAwbs) * 100).toFixed(
                1,
              )}
              %
            </span>{" "}
            appear in only one sheet and may require investigation.
          </p>
        </div>
      </Card>
    </div>
  )
}

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
      label: "Total AWB Unik",
      value: stats.totalUniqueAwbs,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Kecocokan Sempurna",
      value: stats.perfectMatches,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "Ada di semua 3 sheet dengan berat yang cocok",
    },
    {
      label: "Ketidakcocokan Berat",
      value: stats.weightMismatches,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Ada tetapi berat tidak cocok",
    },
    {
      label: "Di Semua Tiga Sheet",
      value: stats.inAllThree,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ]

  const distributionCards = [
    {
      label: "JASTER aja",
      value: stats.inJasterOnly,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "CIS aja",
      value: stats.inCisOnly,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "UNIFIKASI aja",
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
    <div className="space-y-8">
      {/* Executive Summary Banner */}
      <div className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Ringkasan Rekonsiliasi</h3>
            <p className="text-sm text-muted-foreground">Gambaran umum perbandingan AWB di semua sistem</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center px-4 border-r border-border/50">
              <p className="text-3xl font-bold text-primary">{stats.totalUniqueAwbs}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Total AWB</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-success">{Math.round((stats.perfectMatches / stats.totalUniqueAwbs) * 100)}%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Tingkat Kecocokan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary"></div>
          Indikator Kinerja
        </h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border border-border/60 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} ring-1 ring-inset ring-black/5`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">{stat.value.toLocaleString()}</p>
                  {stat.description && <p className="text-xs text-muted-foreground pt-1">{stat.description}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Distribution */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary"></div>
          Distribusi AWB
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {distributionCards.map((stat) => (
            <Card key={stat.label} className="border border-border/60 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ring-1 ring-inset ring-black/5`}>
                    <XCircle className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Executive Insights */}
      <Card className="border border-border/60 bg-gradient-to-br from-slate-50 to-white shadow-sm">
        <div className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary"></div>
            Wawasan Utama
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-border/50">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {((stats.perfectMatches / stats.totalUniqueAwbs) * 100).toFixed(1)}% Tingkat Kecocokan Sempurna
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.perfectMatches.toLocaleString()} AWB tervalidasi di semua sistem dengan berat yang cocok
                </p>
              </div>
            </div>

              <div>
                <p className="text-sm font-medium text-foreground">
                  {((stats.weightMismatches / stats.totalUniqueAwbs) * 100).toFixed(1)}% Ketidakcocokan Berat
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.weightMismatches.toLocaleString()} AWB memerlukan perhatian untuk validasi berat
                </p>
              </div>            {(stats.inJasterOnly + stats.inCisOnly + stats.inUnifikasiOnly) > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-destructive/30">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                              <div>
                <p className="text-sm font-medium text-foreground">
                  {(((stats.inJasterOnly + stats.inCisOnly + stats.inUnifikasiOnly) / stats.totalUniqueAwbs) * 100).toFixed(1)}% Hanya di Satu AWB
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(stats.inJasterOnly + stats.inCisOnly + stats.inUnifikasiOnly).toLocaleString()} AWB ditemukan hanya di satu sistem - disarankan untuk investigasi
                </p>
              </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useCallback, memo } from "react"
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { parseExcelFile } from "@/lib/excel-parser"
import { compareSheets } from "@/lib/comparison-engine"
import type { ComparisonResult } from "@/lib/types"
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"

interface ExcelUploaderProps {
  onComparisonComplete: (result: ComparisonResult) => void
  onError: (error: string) => void
}

export const ExcelUploader = memo(function ExcelUploader({ onComparisonComplete, onError }: ExcelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const processFile = useCallback(
    async (file: File) => {
      // Validate file type
      const isValidType = ACCEPTED_FILE_TYPES.some((type) => file.name.endsWith(type))
      if (!isValidType) {
        onError(`Please upload a valid Excel file (${ACCEPTED_FILE_TYPES.join(", ")})`)
        return
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        onError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`)
        return
      }

      setIsProcessing(true)
      setFileName(file.name)

      try {
        const parsedData = await parseExcelFile(file)
        const comparisonResult = compareSheets(parsedData)
        onComparisonComplete(comparisonResult)
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to process Excel file")
      } finally {
        setIsProcessing(false)
      }
    },
    [onComparisonComplete, onError]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        await processFile(file)
      }
    },
    [processFile]
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        await processFile(file)
      }
    },
    [processFile]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-3xl">
        {/* Instructions Card */}
        <Card className="mb-6 border border-border/60 bg-gradient-to-br from-white to-slate-50 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Data Comparison Workflow
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-primary font-semibold text-xs">1</span>
                </div>
                <p className="font-medium text-foreground">Upload File</p>
                <p className="text-xs text-muted-foreground mt-1">Excel workbook with required sheets</p>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-primary font-semibold text-xs">2</span>
                </div>
                <p className="font-medium text-foreground">Auto Processing</p>
                <p className="text-xs text-muted-foreground mt-1">System validates & compares</p>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-primary font-semibold text-xs">3</span>
                </div>
                <p className="font-medium text-foreground">Review Results</p>
                <p className="text-xs text-muted-foreground mt-1">Insights & discrepancies</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Upload Card */}
        <Card className="border border-border/60 bg-white shadow-lg">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
              relative cursor-pointer rounded-xl border-2 border-dashed p-16 text-center transition-all
              ${isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border/50 hover:border-primary/40 hover:bg-slate-50/50"}
              ${isProcessing ? "pointer-events-none opacity-60" : ""}
            `}
          >
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" />

            <div className="flex flex-col items-center gap-6">
              {isProcessing ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping">
                      <div className="h-24 w-24 rounded-full bg-primary/20"></div>
                    </div>
                    <Loader2 className="relative h-24 w-24 animate-spin text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Analyzing Data...</h3>
                    <p className="text-sm text-muted-foreground mt-2">Processing {fileName}</p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse">
                      <div className="h-28 w-28 rounded-full bg-primary/5"></div>
                    </div>
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10 border-2 border-primary/20">
                      <Upload className="h-14 w-14 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">Upload Comparison File</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Drop your Excel workbook here or click to select from your device
                    </p>
                  </div>
                  <Button size="lg" variant="default" className="mt-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <FileSpreadsheet className="mr-2 h-5 w-5" />
                    Choose File
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"></div>
                  <span className="font-mono font-medium">JASTER</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"></div>
                  <span className="font-mono font-medium">CIS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"></div>
                  <span className="font-mono font-medium">UNIFIKASI</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Required worksheet names (case-sensitive)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
})
